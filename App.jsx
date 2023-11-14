import { useState, useEffect } from "react";
import styled from "styled-components";

//env
const URL_FACTS = import.meta.env.VITE_URL_FATCS;
//opciones de intersectionObserver
const observeOptions = { rootMargin: "0px 0px 0px 0px", threshold: 1.0 };

let endPage = 0;

function App() {
  const [facts, setFacts] = useState([]);
  const [page, setPage] = useState(1);

  //al cargar la página solicita los facts
  useEffect(() => {
    getFacts();
  }, []);

  //al cambiar estado de facts;
  useEffect(() => {
    observerIntersection();
  }, [facts]);

  //al cambiat estado de page solicia registros de la segunda página;
  useEffect(() => {
    getFacts();
  }, [page]);

  //en la intersección cambia la página;
  const observerCallback = (entradas, observer) => {
    entradas.forEach((entrada) => {
      if (entrada.isIntersecting) {
        if(page < endPage){
          setPage((last) => last + 1);
          observer.unobserve(entrada.target);
        }
      }
    });
    return;
  };

  //elemento a observar
  const setObserver = (observer) => {
    const allFacts = document.querySelectorAll("section p");
    if (allFacts.length) {
      const lastFact = allFacts[allFacts.length - 1];
      observer.observe(lastFact);
    }
    return;
  };

  //para scroll infinito
  const observerIntersection = () => {
    let observer = new IntersectionObserver(observerCallback, observeOptions);
    setObserver(observer);
    return () => observer.disconnect();
  };

  //solicitador de facts
  const getFacts = async () => {
    try {
      const response = await fetch(`${URL_FACTS}${page}`);
      if (response.ok) {
        const data = await response.json();
        endPage = data.last_page;
        setFacts((lastData) => [...lastData, ...data.data]);
      }
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Section>
      {facts.map((fact, i) => (
        <Parraf key={i}>{fact.fact}</Parraf>
      ))}
    </Section>
  );
}

export default App;

const Section = styled.section`
  padding: 2rem;
  background: #45474b;
`;

const Parraf = styled.p`
  padding: 2rem;
  font-size: 1rem;
  color: white;
  background: #495e57;
`;
