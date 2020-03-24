import React from 'react';

import DSAItemList from '../controls/DSAItemList';

import {getRandomElement} from '../utils/RandomUtils';

const NUM_NAMES_TO_GENEREATE = 10;

function generateNames(args, seed) {
    let names = []
    for(let i = 0; i < NUM_NAMES_TO_GENEREATE; ++i) {
      const name = args.reduce((sum, a) => {
        if(a && a.names.length > 0) {
          sum += getRandomElement(a.names, seed) + a.sep;
        }
        return sum;
      }, "");
      names.push(name);
    }
    return names;
}

function getGender(part, gender) {
  let retval = []
  if(!gender || gender === "x") {
    if(part.m)
      retval.push(...part.m);
    if(part.w)
      retval.push(...part.w);
  }
  else if(part[gender]) {
    retval.push(...part[gender]);
  }
  if(part.x){
    retval.push(...part.x);
  }
  return retval;
}

function generatePart(part, fallback, suffix, sep, gender) {
  if(part && part[suffix]) {
    return {sep: sep, names: getGender(part[suffix], gender)};
  }
  else if(fallback && fallback[suffix]){
    return {sep: sep, names: getGender(fallback[suffix], gender)};
  }
  return undefined;
}

function generatePartWithSuffix(part, fallback, gender) {
  return [
    generatePart(part, fallback, "prefix", "", gender),
    generatePart(part, fallback, "names", " ", gender),
    generatePart(part, fallback, "postfix", "", gender)
  ];
}

const PARTS = ["pre", "second", "post"];
const FALLBACK = "normal";

const RandomNameGenerator = (props) => {
  const {gender, region, onNameChosen, names, option, seed} = props;
  const nameRedirection = (n) => (e) => {
    onNameChosen(n);
  }
  const t = option ? option : FALLBACK;
  const parts = PARTS.map(part =>
    generatePartWithSuffix(names[t][part],
      names[FALLBACK][part],
      gender)
  ).flat(1);
  const generatedNames = generateNames(parts, seed);
  const items = generatedNames.map(n => {
    return {value: n, action: nameRedirection(n)}
  });
  return <DSAItemList items={[ {title: region, items: items}]} />
};

export default RandomNameGenerator;
