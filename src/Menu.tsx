import { forwardRef } from "react";
import { Form } from "react-bootstrap";

interface Props {
  setShowMenu: Function;
  showMarkers: boolean;
  setShowMarkers: Function;
  showArrows: boolean;
  setShowArrows: Function;
  intervalMinutes: number;
  setIntervalMinutes: Function;
}

const Menu = forwardRef<HTMLDivElement, Props>((props, ref) => {
  const {
    showMarkers,
    setShowMarkers,
    showArrows,
    setShowArrows,
    intervalMinutes,
    setIntervalMinutes,
  } = props;

  return (
    <div className="Menu" ref={ref}>
      <div className="MenuItem MenuItemInterval">
        <div
          className="MenuItemIntervalLeft"
          onClick={() => setShowMarkers(!showMarkers)}
        >
          <Form.Check
            id="a72e8c4b-fdc5-4cbe-93e3-d2ac61c7ad03"
            checked={showMarkers}
            onChange={() => null}
            type="checkbox"
          />
        </div>
        <div
          className={`MenuItemIntervalRight ${
            showMarkers
              ? "MenuItemIntervalRightEnabled"
              : "MenuItemIntervalRightDisabled"
          }`}
        >
          <div
            className="MenuItemIntervalBtn"
            onClick={
              showMarkers
                ? () =>
                    setIntervalMinutes(
                      intervalMinutes > 5 ? intervalMinutes - 1 : 5
                    )
                : () => null
            }
          >
            <span className="material-symbols-outlined">
              keyboard_arrow_down
            </span>
          </div>
          <div className="MenuItemIntervalValue">
            <p>{intervalMinutes}</p>
          </div>
          <div
            className="MenuItemIntervalBtn"
            onClick={
              showMarkers
                ? () =>
                    setIntervalMinutes(
                      intervalMinutes < 30 ? intervalMinutes + 1 : 30
                    )
                : () => null
            }
          >
            <span className="material-symbols-outlined">keyboard_arrow_up</span>
          </div>
        </div>
      </div>
      <div className="MenuItem MenuItemShowOrHideArrows">
        <div
          className="MenuItemShowOrHideArrowsLeft"
          onClick={() => setShowArrows(!showArrows)}
        >
          <Form.Check
            id="a8393d1f-47f2-4baf-8111-d99cc23138e1"
            checked={showArrows}
            onChange={() => null}
            type="checkbox"
          />
        </div>
        <div
          className={`MenuItemShowOrHideArrowsRight ${
            showArrows
              ? "MenuItemShowOrHideArrowsRightEnabled"
              : "MenuItemShowOrHideArrowsRightDisabled"
          }`}
        >
          <span className="material-symbols-outlined">arrow_forward</span>
          <span className="material-symbols-outlined">arrow_forward</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </div>
      </div>
    </div>
  );
});

export default Menu;
