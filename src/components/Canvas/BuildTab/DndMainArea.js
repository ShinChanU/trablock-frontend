import React, { useCallback } from 'react'; // useEffect
import { DragDropContext } from 'react-beautiful-dnd';
import styled from 'styled-components';
import Day from 'components/Canvas/BuildTab/Day';
import CategoryBlock from 'components/Canvas/BuildTab/CategoryBlock';

const Container = styled.div`
  display: flex;
  flex: 1;
  justify-content: space-between;
`;

const Basket = styled.div`
  width: 280px;
  background-color: rgb(109, 144, 176);
  overflow: auto;

  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #2f3542;
  }
  ::-webkit-scrollbar-track {
    background-color: grey;
  }
`;

const Days = styled.div`
  display: flex;
  flex: 1; //남은 영역 모두 채움
  justify-content: space-around;
`;

const categoryObj = {
  attractions: '관광지',
  restaurants: '음식점',
  accommodations: '숙박시설',
};

const categoryKeys = Object.keys(categoryObj);

const DndMainArea = ({ userPlan, globalLocations, setUserPlanData }) => {
  const { travelDays, dayOrder, selectedLocations } = userPlan;

  const onClick = useCallback((day, location, index) => {
    const category = location.category.slice();
    const newSelLocOrder = { ...selectedLocations };
    const newDayOrder = { ...travelDays };
    newDayOrder[day.id].locationIds.splice(index, 1);
    newSelLocOrder[category].push(location.id);
    setUserPlanData({
      ...userPlan,
      selectedLocations: newSelLocOrder,
      travelDays: newDayOrder,
    });
    return;
  }, []); // waring 해결 못함

  const onDragEnd = (result) => {
    // dnd 구현
    const { destination, source, draggableId } = result;
    if (!destination) return;
    const startDropId = source.droppableId;
    const endDropId = destination.droppableId;
    if (
      // 출발 selectedLocation, 도착 day
      categoryKeys.indexOf(startDropId) !== -1 &&
      categoryKeys.indexOf(endDropId) === -1
    ) {
      const dragIdObj = {};
      dragIdObj[startDropId] = draggableId;
      const newSelLocOrder = { ...selectedLocations };
      const newDayOrder = { ...travelDays };
      newSelLocOrder[startDropId].splice(source.index, 1);
      newDayOrder[endDropId].locationIds.splice(
        destination.index,
        0,
        dragIdObj,
      );
      setUserPlanData({
        ...userPlan,
        selectedLocations: newSelLocOrder,
        travelDays: newDayOrder,
      });
      return;
    } else if (
      // 출발 day, 도착 day(같은 day에서도 사용)
      categoryKeys.indexOf(startDropId) === -1 &&
      categoryKeys.indexOf(endDropId) === -1
    ) {
      const dragIdObj = {};
      const newDayOrder = { ...travelDays };
      const temp = newDayOrder[startDropId].locationIds.splice(source.index, 1);
      dragIdObj[Object.keys(temp[0])[0]] = draggableId;
      newDayOrder[endDropId].locationIds.splice(
        destination.index,
        0,
        dragIdObj,
      );
      setUserPlanData({
        ...userPlan,
        travelDays: newDayOrder,
      });
      return;
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Container>
          {/* 담은 블록 */}
          <Basket>
            {categoryKeys.map((category) => {
              // 카테고리별로 데이터 전달
              const locations = selectedLocations[category].map(
                (locationId) => {
                  let locObj = {};
                  locObj = globalLocations[category][locationId];
                  locObj['category'] = category;
                  return locObj;
                },
              );
              return (
                <CategoryBlock
                  key={category}
                  locations={locations}
                  type={category}
                  onClick={onClick}
                />
              );
            })}
          </Basket>
          {/* 데이 */}
          <Days>
            {dayOrder &&
              dayOrder.map((dayId) => {
                // 데이 개수, 순서에 따라 저장된 데이터 전달(json)
                const day = travelDays[dayId]; // object
                const locations = day.locationIds.map((locationId) => {
                  let locObj = {};
                  let category = Object.keys(locationId).join();
                  let key = locationId[category];
                  locObj = globalLocations[category][key];
                  locObj['category'] = category;
                  return locObj;
                });
                return (
                  <Day
                    key={day.id}
                    day={day}
                    locations={locations}
                    onClick={onClick}
                    // moveData={day.moveData}
                  />
                );
              })}
          </Days>
        </Container>
      </DragDropContext>
    </>
  );
};

export default DndMainArea;

// 참고 레퍼런스
// https://codesandbox.io/s/react-beautiful-dnd-example-forked-9l3wz8?file=/src/index.js

// 0307
// https://react-icons.github.io/react-icons/
// https://technicolour.tistory.com/56
