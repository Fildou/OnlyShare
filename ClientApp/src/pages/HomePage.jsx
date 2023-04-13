import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import CardComponent from "../components/main/card";
import "./HomePage.css";
import "../components/main/card.css";
import axios from "axios";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);

  const posts = [
    {
      id: 1,
      title: "Ako by ste vyriešili globálne otepllovanie?",
      text: "Chcel by som vedieť vaše názory na globálne oteplovanie.",
      date: "01/04/2023"
    },
    {
      id: 2,
      title: "Ako sa robi v QGIS????",
      text: "Tento program je robený v QT, pre BOHA prečo? A ešt nás v tom nútia robiť, no ja to fakt už nadávam na tejto škole. Proste kde sa dáva tá odhláška. Ja to tam podám lebo toto sa fakt nedá. ZMENÍM TO. AJ KEBY SOM MAL SMEŤÁRA ROBIŤ.",
      date: "03/09/2023"
    },
    {
      id: 3,
      title: "Problém s toaletami na 3. poschodí.",
      text: "Na treťom poschodí na dievčenských toaletách sa nachádza trol! Kto nechce zomrieť strašlivou smrťou, vyhýbajte sa im.",
      date: "11/12/2003"
    },
    {
      id: 4,
      title: "Niekto dungeon vo WoW?",
      text: "Som Holy Paladin, 39 lvl. Hladam Tanka a 3 dps. Rychlo, rychlo.",
      date: "11/04/20"
    },
  ];

  
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get("/api/questions");
        setQuestions(response.data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

  const allPosts = [...questions, ...posts].sort((a, b) => b.id - a.id);

  return (
    <Container>
      <h1 className="posts-heading">Posts</h1>
      <Row>
        {allPosts.map((post) => (
          <Col key={post.id} md="12" className="mb-4">
            <CardComponent
              title={post.title}
              text={post.text || post.description}
              date={formatDate(post .date || post.createdAt)}
              postId={post.id}
            />
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default HomePage;