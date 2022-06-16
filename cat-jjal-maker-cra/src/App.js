import logo from "./logo.svg";
import "./App.css";
import React from "react";
import Title from "./components/Title";

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};

const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem(props) {
  return (
    <li style={{ listStyleType: "none" }}>
      <img src={props.img} style={{ width: "150px" }} />
    </li>
  );
}
function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해보아요!</div>;
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem img={cat} key={cat} />
      ))}
    </ul>
  );
}
// const MainCard = (props) => {
//   return (
//     <div className="main-card">
//       <img src={props.img} alt="고양이" width="400" />
//       <button>:white_heart:</button>
//     </div>
//   );
// };

const MainCard = ({ img, handleHeartClick, clicked }) => {
  const heartIcon = clicked ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img src={img} alt="고양이" width="400" />
      <button className="Heart" onClick={handleHeartClick}>
        {heartIcon}
      </button>
    </div>
  );
};

const Form = ({ updateMainCat }) => {
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [value, setValue] = React.useState("");
  const [errorMsg, SetErrorMsg] = React.useState("");
  function handleInputChange(e) {
    const userValue = e.target.value;
    SetErrorMsg("");
    if (includesHangul(userValue)) {
      SetErrorMsg("한글 입력 안됨");
    }
    setValue(userValue.toUpperCase());
  }

  function handleFormSubmit(e) {
    e.preventDefault();
    SetErrorMsg("");
    if (value === "") {
      SetErrorMsg("빈 값은 안됨");
      return;
    }
    updateMainCat(value);
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input
        onChange={handleInputChange}
        type="text"
        name="name"
        placeholder="영어 대사를 입력해주세요"
        value={value}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMsg}</p>
    </form>
  );
};
const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 =
    "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";
  // const [counter, setCounter] = React.useState(
  //   jsonLocalStorage.getItem("counter")
  // );

  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });

  const [mainCat, setMainCat] = React.useState(CAT1);
  const [favorites, setFavorites] = React.useState(
    jsonLocalStorage.getItem("favorites") || []
  );

  React.useEffect(() => {
    setInitialCat();
  }, []);
  const clicked = favorites.includes(mainCat);
  async function setInitialCat() {
    const newCat = await fetchCat("First cat");
    setMainCat(newCat);
  }

  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    setMainCat(newCat);

    // setCounter(nextCounter);
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    });
  }

  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCat];
    setFavorites(nextFavorites);
    jsonLocalStorage.setItem("favorites", nextFavorites);
  }

  // const counterTitle = counter === null ? '' : counter + "번째";
  return (
    <div className="container">
      {counter >= 1 ? (
        <Title>{counter}번째 고양이 가라시대</Title>
      ) : (
        <Title>고양이 가라시대</Title>
      )}
      <Form updateMainCat={updateMainCat} />
      <MainCard
        img={mainCat}
        handleHeartClick={handleHeartClick}
        clicked={clicked}
      />
      <Favorites favorites={favorites} />
    </div>
  );
};

export default App;
