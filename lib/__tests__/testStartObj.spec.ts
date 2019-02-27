import {TYPE} from "../constants";
import {StartTestItem} from "../entities";

function getStringWithLength(length: number) {
  return new Array(length + 1).join("S");
}

describe("StartTestItem", () => {
  test("should store name and default parameters", () => {
    const testStartObj = new StartTestItem("foo");

    expect(testStartObj.name).toEqual("foo");
    expect(testStartObj.type).toEqual(TYPE.STEP);
    expect(testStartObj.parameters).toBeUndefined();
    expect(testStartObj.tags).toBeUndefined();
  });

  test("should trim long names", () => {
    expect(new StartTestItem(getStringWithLength(257)).name.length).toEqual(256);
    expect(new StartTestItem(getStringWithLength(256)).name.length).toEqual(256);
    expect(new StartTestItem(getStringWithLength(255)).name.length).toEqual(255);
  });

});
