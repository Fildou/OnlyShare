using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using OnlyShare.Contracts;
using OnlyShare.Services;
using OnlyShare.Database;
using OnlyShare.Database.Models;
using Microsoft.AspNetCore.Identity;

namespace OnlyShare.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController : ControllerBase
{
    private readonly DataContext _dataContext;
    private readonly IOptions<AppSettings> _options;
    private readonly IEmailService _emailService;
    private readonly UserManager<IdentityUser> _userManager;

    public AccountController(DataContext dataContext, IOptions<AppSettings> options, IEmailService emailService, UserManager<IdentityUser> userManager)
    {
        _dataContext = dataContext;
        _options = options;
        _emailService = emailService;
        _userManager = userManager;
    }

    [HttpPost("[action]")]
    public IActionResult Register(RegisterRequest request)
    {
        // prazdne polia
        //if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password) || string.IsNullOrWhiteSpace(request.PasswordRepeat))
        //return BadRequest("Žiadne pole nesmie byť prázdne.");
        // zhoda hesiel
        if (request.Password != request.PasswordRepeat)
            return BadRequest("Passwords does not match");
        // duplikovana registracia
        if (_dataContext.Users != null && _dataContext.Users.Any(user => user.Email == request.Email))
            return BadRequest($"Uživatel s emailem {request.Email} je již registrován");
        // spravny format mailu
        var emailRegex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
        if (!emailRegex.IsMatch(request.Email))
            return BadRequest("Neplatný formát e-mailu");

        var (passwordSalt, passwordHash) = CreatePasswordHash(request.Password);

        var user = new User
        {
            Email = request.Email,
            Username = request.Username,
            PasswordHash = passwordHash,
            PasswordSalt = passwordSalt
        };

        _dataContext.Add(user);
        _dataContext.SaveChanges();

        // send email here

        return Ok("Uživatel vytvořen");
    }

    private static (byte[] passwordSalt, byte[] passwordHash) CreatePasswordHash(string password)
    {
        using var hmac = new System.Security.Cryptography.HMACSHA512();
        var passwordSalt = hmac.Key;
        var passwordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return (passwordSalt, passwordHash);
    }

    [HttpPost("[action]")]
    public IActionResult Login(LoginRequest request)
    {
        var user = _dataContext.Users!.FirstOrDefault(user => request.Email == user.Email);

        if (user == null)
            return NotFound($"Uživatel nenalezen.");

        if (VerifyPasswordHash(request.Password, user.PasswordHash, user.PasswordSalt) == false)
            return BadRequest("Neplatné přihlášení");


        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_options.Value.JwtSecret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("id", user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Email)
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        if (tokenString == null)
            return BadRequest("Nepodařilo se přihlásit");

        return Ok(new LoginResponse { Token = tokenString });
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Email))
            return BadRequest("E-mail nesmie byť prázdny.");

        var user = _dataContext.Users!.FirstOrDefault(u => u.Email == request.Email);

        if (user == null)
            return NotFound($"Užívateľ nebol nájdený.");

        // Generate password reset token manually
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_options.Value.JwtSecret);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
            new Claim("id", user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Email)
        }),
            Expires = DateTime.UtcNow.AddHours(1), // Set the expiration time for the reset token
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var resetToken = tokenHandler.WriteToken(tokenHandler.CreateToken(tokenDescriptor));

        // Send the email with the reset token
        var emailResult = await _emailService.SendPasswordResetInstructions(user.Email, resetToken);

        if (!emailResult)
            return BadRequest("Nepodarilo sa odoslať e-mail s inštrukciami na obnovu hesla.");

        return Ok("Inštrukcie na obnovu hesla boli odoslané na váš e-mail.");
    }

    [HttpPost("[action]")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var resetResult = await ResetUserPassword(request.Email, request.Token, request.Password);
        if (!resetResult)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, "Error resetting password.");
        }

        return Ok("Password has been successfully reset.");
    }


    private static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
    {
        if (storedHash.Length != 64)
            throw new ArgumentException("Invalid length of password hash (64 bytes expected).", nameof(storedHash));
        if (storedSalt.Length != 128)
            throw new ArgumentException("Invalid length of password salt (128 bytes expected).", nameof(storedSalt));

        using var hmac = new System.Security.Cryptography.HMACSHA512(storedSalt);
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        for (var i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != storedHash[i]) return false;
        }

        return true;
    }

    private async Task<bool> ResetUserPassword(string email, string token, string newPassword)
    {
        var user = _dataContext.Users.FirstOrDefault(u => u.Email == email);
        if (user == null)
        {
            return false;
        }

        // ověřte platnost resetovacího tokenu
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_options.Value.JwtSecret);
        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
        };

        try
        {
            tokenHandler.ValidateToken(token, validationParameters, out _);
        }
        catch (Exception)
        {
            return false;
        }

        // aktualizujte heslo
        var (passwordSalt, passwordHash) = CreatePasswordHash(newPassword);
        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        _dataContext.Update(user);
        await _dataContext.SaveChangesAsync();

        return true;
    }
}