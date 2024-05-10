import { TextDeco } from "src/modules/Editor/types/search";

export const getOrisonAdvanceSearch = (
  savedString: string,
  searchData: {
    textSearchAdvance: string[];
    typeSearchAdvance: string[];
    textSearch: string;
  }
) => {
  const { textSearchAdvance, typeSearchAdvance, textSearch } = searchData;
  const result: { text: string; deco: boolean }[][] = [];

  let currentIndex: number = 0;
  let fromIndex: number = 0;
  let count: number = 0;
  const maxCount: number = 3;
  while (
    (currentIndex = savedString
      .toLowerCase()
      .indexOf(textSearch?.toLowerCase(), currentIndex)) !== -1 &&
    count < maxCount
  ) {
    result[count] = [];
    result[count].push({
      deco: false,
      text: savedString.substring(0, currentIndex),
    });
    result[count].push({
      deco: true,
      text: savedString.substring(
        currentIndex,
        currentIndex + textSearch.length
      ),
    });
    fromIndex = currentIndex + textSearch.length;
    typeSearchAdvance.map((type, i) => {
      if (type != "not") {
        currentIndex = savedString
          .toLowerCase()
          .indexOf(textSearchAdvance[i]?.toLowerCase(), currentIndex);
        if (currentIndex != -1) {
          result[count].push({
            deco: false,
            text: savedString.substring(fromIndex, currentIndex),
          });
          result[count].push({
            deco: true,
            text: savedString.substring(
              currentIndex,
              currentIndex + textSearchAdvance[i].length
            ),
          });
          fromIndex = currentIndex + textSearchAdvance[i].length;
        }
      }
    });
    result[count].push({
      deco: false,
      text: savedString.substring(fromIndex, savedString.length - 8),
    });

    count++;
    currentIndex += textSearch.length;
  }
  return result;
};

export const getOrisonAdjacentSearch = (
  savedString: string,
  textSearch: string
): TextDeco[][] => {
  const tempText = textSearch?.split("_");
  const [prevText, _prevRange, midText, nextText, _nextRange] = tempText || [];

  const prevRange = parseInt(_prevRange);
  const nextRange = parseInt(_nextRange);
  //   console.log("tempText", tempText);
  if (!tempText || !textSearch) {
    return [];
  }
  const result: TextDeco[][] = [];
  let currentIndex: number = 0;
  let count: number = 0;
  const maxCount: number = 3;

  while (count < maxCount) {
    const prevIndex = savedString.toLowerCase().indexOf(prevText, currentIndex);
    if (prevIndex < 0) {
      break;
    }
    const midIndex = savedString
      .toLowerCase()
      .indexOf(midText, prevIndex + prevText.length);
    if (midIndex < 0) {
      break;
    }
    const nextIndex = savedString
      .toLowerCase()
      .indexOf(nextText, midIndex + midText.length);
    if (nextIndex < 0) {
      break;
    }

    const beforeResultString = savedString.substring(currentIndex, prevIndex);
    const leftMidString = savedString.substring(
      prevIndex + prevText.length,
      midIndex
    );
    const rightMidString = savedString.substring(
      midIndex + midText.length,
      nextIndex
    );
    const afterResultString = savedString.substring(
      nextIndex + nextText.length,
      nextIndex + nextText.length + 30
    );

    if (
      leftMidString.trim().replace(/\s\s+/g, " ").split(" ").length >
      nextRange + 5
    ) {
      currentIndex = prevIndex + prevText.length;
      continue;
    }

    if (
      rightMidString.trim().replace(/\s\s+/g, " ").split(" ").length >
      prevRange + 5
    ) {
      currentIndex = prevIndex + prevText.length;
      continue;
    }
    currentIndex = nextIndex + nextText.length;

    if (savedString.startsWith("[0247l01]")) {
      console.log("prevIndex", prevIndex);
      console.log("midIndex", midIndex);
      console.log("nextIndex", nextIndex);

      console.log("beforeResultString", beforeResultString);
      console.log("leftMidString", leftMidString);
      console.log("rightMidString", rightMidString);
      console.log("afterResultString", afterResultString);
    }

    result.push([
      {
        text:
          (currentIndex != 0 || beforeResultString.length > 30 ? "..." : "") +
          beforeResultString.substring(beforeResultString.length - 30),
        deco: false,
      },
      { text: prevText, deco: true },
      {
        text:
          leftMidString.length < 35
            ? leftMidString
            : `${leftMidString.substring(0, 15)}...${leftMidString.substring(
                leftMidString.length - 15
              )}`,
        deco: false,
      },
      { text: midText, deco: true },
      {
        text:
          rightMidString.length < 35
            ? rightMidString
            : `${rightMidString.substring(0, 15)}...${rightMidString.substring(
                rightMidString.length - 15
              )}`,
        deco: false,
      },
      { text: nextText, deco: true },
      {
        text: afterResultString + "...",
        deco: false,
      },
    ]);
    count++;
  }
  return result;
};
