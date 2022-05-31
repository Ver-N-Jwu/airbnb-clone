import { useEffect, useRef, useState } from "react";

import PAUSE_ICON from "@assets/pause-icon.svg";
import X_ICON from "@assets/x-icon.svg";
import Icon from "@components/common/Icon";
import Modal from "@components/common/Modal";
import TextBox from "@components/common/TextBox";

import * as S from "./style";
interface props {
  modalOpen: number;
  setModalOpen: React.Dispatch<React.SetStateAction<number>>;
}

interface coordinates {
  x: number;
  y: number;
}

const Price = ({ modalOpen, setModalOpen }: props) => {
  const onClickHandler = () => {
    setModalOpen(2);
  };

  return (
    <>
      <S.Price onClick={onClickHandler}>
        <TextBox label={`요금`} text={`금액대 설정`} />
        <Icon iconName={X_ICON} iconSize={"base"} />
      </S.Price>
      {modalOpen === 2 && (
        <Modal setModalOpen={setModalOpen}>
          <PriceRangeGraph />
        </Modal>
      )}
    </>
  );
};

const PriceRangeGraph = () => {
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [average, setAverage] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current as HTMLCanvasElement;
  const context = canvas?.getContext("2d");

  //데이터 받는 로직 임시 주석화
  // const priceArray: number[] = [];

  // const roomsData = getData("fakeDB.json").then((json) => {
  //   json.rooms.forEach((room: { salePrice: number }) => {
  //     priceArray.push(room.salePrice);
  //   });
  //   priceArray.sort((a: number, b: number) => a - b);
  //   setMinPrice(priceArray[0]);
  //   setMaxPrice(priceArray[priceArray.length - 1]);
  //   setAverage(
  //     priceArray.reduce((acc: number, cur: number) => {
  //       return acc + cur;
  //     }, 0) / priceArray.length,
  //   );
  // });

  //TODO: 데이터 받아오면 수정할 부분
  useEffect(() => {
    if (minPrice === 0 || maxPrice === 0 || average === 0) {
      setMinPrice(Math.min(...mockArray.map(({ x }) => x)));
      setMaxPrice(Math.max(...mockArray.map(({ x }) => x)));
      setAverage(getAverage(mockArray) >> 0);
    }
  }, []);

  drawGraph(context, mockArray);

  return (
    <>
      <div>
        {/* TODO: Description 컴포넌트로 변경 */}
        <div>가격 범위</div>
        <div>
          {minPrice} - {maxPrice}
        </div>
        <div>평균 1박 요금은 {average}원 입니다.</div>
        {/* TODO: Description 컴포넌트로 변경 */}

        <canvas width="365" height="100" ref={canvasRef} />
        <Slider min={minPrice} max={maxPrice} />
      </div>
    </>
  );
};

interface sliderProps {
  min: number;
  max: number;
}

const Slider = ({ min, max }: sliderProps) => {
  // const onChangeHandlerMin = () => {};
  return (
    <S.Slider>
      <S.LeftInput type="range" min={min} max={max} />
      <S.RightInput type="range" min={min} max={max} />
    </S.Slider>
  );
};

const getData = async (url: string) => {
  const data = await fetch(url);

  return data.json();
};

const mockArray = [
  { x: 15000, y: 5 },
  { x: 30000, y: 14 },
  { x: 50000, y: 10 },
  { x: 70000, y: 14 },
  { x: 90000, y: 26 },
  { x: 100000, y: 30 },
  { x: 120000, y: 45 },
  { x: 130000, y: 60 },
  { x: 135000, y: 65 },
  { x: 140000, y: 80 },
  { x: 143000, y: 70 },
  { x: 150000, y: 50 },
  { x: 170000, y: 66 },
  { x: 200000, y: 25 },
  { x: 240000, y: 16 },
  { x: 300000, y: 45 },
  { x: 320000, y: 10 },
  // { x: 350000, y: 40 },
  // { x: 400000, y: 35 },
  // { x: 600000, y: 30 },
  // { x: 800000, y: 20 },
  // { x: 900000, y: 10 },
  // { x: 1000000, y: 1 },
];

const getAverage = (priceArray: coordinates[]) => {
  const totalAmount = priceArray.map(({ y }) => y).reduce((acc, cur) => acc + cur, 0);
  const totalPrice = priceArray.map(({ x, y }) => x * y).reduce((acc, cur) => acc + cur, 0);

  return totalPrice / totalAmount;
};

const drawGraph = (context: CanvasRenderingContext2D | null, mockArray: coordinates[]) => {
  if (!context) return;
  const x_max = Math.max(...mockArray.map(({ x }) => x));
  const x_min = Math.min(...mockArray.map(({ x }) => x));
  const y_max = Math.max(...mockArray.map(({ y }) => y));
  const x_ratio = (x_max - x_min) / 365; //canvas width
  const y_ratio = y_max / 100; //canvas height
  const coordinates = mockArray.map((coordinate) => {
    return { x: (coordinate.x - x_min) / x_ratio, y: 100 - coordinate.y / y_ratio };
  });

  context.beginPath();
  context.moveTo(coordinates[0].x, 100); //(최소가격, height)
  context.lineTo(coordinates[0].x, coordinates[0].y); //시작점 처리
  context.strokeStyle = "lightgray";
  context.fillStyle = "black";

  for (let i = 0; i < coordinates.length - 1; i++) {
    const x_mid = (coordinates[i].x + coordinates[i + 1].x) / 2;
    const y_mid = (coordinates[i].y + coordinates[i + 1].y) / 2;
    const cp_x1 = (x_mid + coordinates[i].x) / 2;
    const cp_x2 = (x_mid + coordinates[i + 1].x) / 2;

    context.quadraticCurveTo(cp_x1, coordinates[i].y, x_mid, y_mid);
    context.quadraticCurveTo(cp_x2, coordinates[i + 1].y, coordinates[i + 1].x, coordinates[i + 1].y);

    context.stroke();
  }
  context.lineTo(coordinates[coordinates.length - 1].x, 100); //끝 점 처리

  context.fill();
};

export default Price;
