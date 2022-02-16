import React, { useState, useRef } from "react";
import "./App.css";

const data = [
  { title: "Group №1", items: ["1", "2", "3"] },
  { title: "Group №2", items: ["4", "5"] },
];

function App() {
  const [list, setList] = useState(data);
  const [dragging, setDragging] = useState(false);

  const dragItem = useRef();
  const dragNode = useRef();

  const dragStartHandle = (e, dragItemParams) => {
    console.log(dragItemParams);
    dragItem.current = dragItemParams;
    dragNode.current = e.target;
    dragNode.current.addEventListener("dragend", dragEndHandler);
    setTimeout(() => {
      setDragging(true);
    }, 0);
  };

  const dragEnterHandler = (e, dragItemParams) => {
    const currentItem = dragItem.current;
    if (e.target !== dragNode.current) {
      console.log("Target is not a same");
      setList((prev) => {
        let newList = JSON.parse(JSON.stringify(prev)); // полная копия массива если делать через [...prev] то появляется лишний элемент
        newList[dragItemParams.grpI].items.splice(
          dragItemParams.itemI,
          0,
          newList[currentItem.grpI].items.splice(currentItem.itemI, 1)[0]
        );
        dragItem.current = dragItemParams;
        return newList;
      });
      setList((prev) => {
        let sortList1 = prev[0].items.sort((a, b) => {
          if (a < b) {
            return -1;
          }
          return 1;
        });
        console.log(sortList1);
        console.log(prev);
        prev[0].items = sortList1;
        return prev;
      });
    }
  };

  const dragEndHandler = (e) => {
    setDragging(false);
    dragNode.current.removeEventListener("dragend", dragEndHandler);
    dragItem.current = null;
    dragNode.current = null;
  };

  const getStyle = (grpI, itemI) => {
    if (dragItem.current.itemI === itemI && dragItem.current.grpI === grpI) {
      return "current dnd-item";
    }
    return "dnd-item";
  };

  return (
    <div className="App">
      <div className="drag-and-drop">
        {list.map((grp, grpI) => (
          <div
            key={grp.title}
            className="dnd-group"
            onDragEnter={
              dragging && !grp.items.length
                ? (e) => dragEnterHandler(e, { grpI, itemI: 0 })
                : null
            }
          >
            <h2>{grp.title}</h2>
            {grp.items.map((item, itemI) => (
              <div
                draggable
                onDragStart={(e) => dragStartHandle(e, { grpI, itemI })}
                onDragEnter={
                  dragging ? (e) => dragEnterHandler(e, { grpI, itemI }) : null
                }
                key={itemI}
                className={dragging ? getStyle(grpI, itemI) : "dnd-item"}
              >
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
