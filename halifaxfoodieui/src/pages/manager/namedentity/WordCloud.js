import React, { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import axios from "axios";

function WordCloud() {
  const [wordList, setWords] = useState(null);
  const url = "https://ass-4ikbgrxxmq-de.a.run.app/wordList";

  useEffect(() => {
    async function fetchUserData() {
      const response = await axios.get(url);
      let json = JSON.parse(
        JSON.stringify(response.data).split('"score":').join('"value":')
      );
      // processData(json);
      setWords(json);
    }
    fetchUserData();
  }, []);

  const processData = (json) => {
    let mapData = {};
    const newData = json.map((obj, index) => {
      if (mapData[obj.text]) {
        mapData[obj.text] += 1;
      } else {
        mapData[obj.text] = 1;
      }
    });
    const data = Object.keys(newData).map((key) => {
      return {
        text: key,
        value: newData[key],
      };
    });
    setWords(data);
  };

  console.log(wordList);

  //   let json = JSON.parse(JSON.stringify(wordList).split('"score":').join('"value":'));

  return <div>{wordList && <ReactWordcloud words={wordList} />}</div>;
}

export default WordCloud;
