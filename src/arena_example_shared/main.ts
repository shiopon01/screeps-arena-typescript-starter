import { Flag } from "arena";
import { prototypes } from "game";
import { ATTACK, ERR_NOT_IN_RANGE, HEAL, MOVE, RANGED_ATTACK, RESOURCE_ENERGY } from "game/constants";
import { Creep, Source, StructureContainer, StructureSpawn } from "game/prototypes";
import { getObjectsByPrototype } from "game/utils";

export function loop(): void {
  const creep = getObjectsByPrototype(Creep).find(mycreep => mycreep.my);
  if (creep?.store[RESOURCE_ENERGY]) {
    const container = getObjectsByPrototype(StructureContainer)?.[0];
    if ()
  }






  const constructionSite = createConstructionSite({x: 50, y: 55}, StructureTower);
  
}

function step8(): void {
  const creep = getObjectsByPrototype(Creep).find(mycreep => mycreep.my);
  const source = getObjectsByPrototype(Source)?.[0];
  const spawn = getObjectsByPrototype(StructureSpawn)?.[0];

  const capacity = creep?.store.getUsedCapacity();
  console.log("capacity", capacity);
  if (capacity === null || capacity === undefined) {
    return;
  }
  if (capacity < 1000) {
    if (creep?.harvest(source) === ERR_NOT_IN_RANGE) {
      console.log("move to source");
      creep.moveTo(source);
    }
  } else {
    if (creep?.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
      console.log("move to spawn");
      creep.moveTo(spawn);
    }
  }
}

let creep1: Creep | undefined;
let creep2: Creep | undefined;
function step7(): void {
  const spawn = getObjectsByPrototype(StructureSpawn)?.[0];
  const flags = getObjectsByPrototype(Flag);

  if (!creep1) {
    creep1 = spawn.spawnCreep([MOVE]).object;
  } else {
    creep1?.moveTo(flags?.[0]);

    if (!creep2) {
      creep2 = spawn.spawnCreep([MOVE]).object;
    } else {
      creep2?.moveTo(flags?.[1]);
    }
  }
}

function step6(): void {
  const creeps = getObjectsByPrototype(Creep).filter(creep => creep.my);
  const flags = getObjectsByPrototype(Flag);

  creeps.forEach(creep => {
    const closestFlag = creep.findClosestByPath(flags);
    if (closestFlag) {
      creep.moveTo(closestFlag);
    }
  });
}

function step5(): void {
  console.log("Tick");

  const myCreep = getObjectsByPrototype(Creep).find(creep => creep.my);
  const enemyCreep = getObjectsByPrototype(Creep).find(creep => !creep.my);
  const towers = getObjectsByPrototype(prototypes.StructureTower);
  if (towers.length === 0) {
    return;
  }

  console.log("tower", towers?.[0]);

  const tower = towers[0];
  if (tower.store[RESOURCE_ENERGY] < 10) {
    const containers = getObjectsByPrototype(StructureContainer);
    if (containers.length === 0) {
      return;
    }
    if (myCreep?.store[RESOURCE_ENERGY] === 0) {
      console.log("creep get energy");
      myCreep?.withdraw(containers[0], RESOURCE_ENERGY);
    } else {
      console.log("creep transfer energy to tower");
      myCreep?.transfer(tower, RESOURCE_ENERGY);
    }
  } else {
    if (!enemyCreep) {
      return;
    }
    console.log("tower attack to enemy");
    tower.attack(enemyCreep);
  }
}

function step4(): void {
  const myCreeps = getObjectsByPrototype(Creep).filter(creep => creep.my);
  const enemyCreep = getObjectsByPrototype(Creep).find(creep => !creep.my);

  if (!enemyCreep) {
    return;
  }

  myCreeps.forEach(creep => {
    if (creep.body.some(bodyPart => bodyPart.type === ATTACK)) {
      if (creep.attack(enemyCreep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(enemyCreep);
      }
    }
    if (creep.body.some(bodyPart => bodyPart.type === RANGED_ATTACK)) {
      if (creep.rangedAttack(enemyCreep) === ERR_NOT_IN_RANGE) {
        creep.moveTo(enemyCreep);
      }
    }
    if (creep.body.some(bodyPart => bodyPart.type === HEAL)) {
      const myDamagedCreeps = myCreeps.filter(i => i.hits < i.hitsMax);
      if (myDamagedCreeps.length > 0) {
        if (creep.heal(myDamagedCreeps[0]) === ERR_NOT_IN_RANGE) {
          creep.moveTo(myDamagedCreeps[0]);
        }
      }
    }
  });
}
