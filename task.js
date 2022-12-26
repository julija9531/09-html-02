class InterestsTree {

    constructor(elem, parentID) {
        this.id = elemID;
        elemsArray.push(this); //Добавляем элемент в линейный список
        elemID++;
        this.children = [];
        this.status = false;
        this.indeterminate = false;

        //Если это не нолевой элемент:
        if (elem != undefined) {
            this.parent = parentID;
            this.label = elem.querySelector("label");
            //Добавление в список к родителю:
            elemsArray[findElem(parentID)].children.push(this);
            this.childUL = elem.querySelector("ul");

            //Если есть вложенные списки:
            if (this.childUL != undefined) {
                for (let i = 0; i < this.childUL.children.length; i++) {
                    new InterestsTree(this.childUL.children[i], this.id);
                }
            }
        };
        
        this.check = 0;//Для проверки активации всех вложенных списков
    }

    //onlick для элемента:
    clickElem() {
        let _this = this; 

        _this.label.onclick = function(event) {
          _this.status = _this.label.children[0].checked;

          //Проверка родителей
          parentCheck(_this);

          //Включение/выключение вложенные элементов:
          childOn(_this, _this.label.children[0].checked);
        }
    }


}

//Поиск элемента по id
function findElem(id) {
    for (let i = 0; i < elemsArray.length; i++) {
        if (elemsArray.at(i).id === id) {return i}
    }
}

//Включение/выключение элементов ниже:
function childOn(parent, onOff) {
    if (parent.children.length > 0) {
        for (let i = 0; i < parent.children.length; i++) {
            parent.children[i].label.children[0].checked = onOff;
            parent.children[i].label.children[0].indeterminate = false;
            parent.children[i].status = onOff;

            //Корректировка this.check:
            if (onOff) {
              parent.children[i].check = parent.children[i].children.length
            } else {parent.children[i].check = 0}

            //Если есть вложенные:
            if (parent.children[i].children.length > 0) {childOn(parent.children[i], onOff)}
        }
    }
}

//Проверка статуса родельских элементов:
function parentCheck(child) {
  //Если у элемента есть родитель:
  if (child.parent > 0) {
    let parent = elemsArray[findElem(child.parent)];
    
    //перебор вложенных элементов родителя, проверка его статуса:
    parent.check = 0;
    parent.indeterminate = false;
    for (i = 0; i < parent.children.length; i++) {
      if (parent.children[i].status) {
        parent.check += 1;
        parent.indeterminate = true;
      };
      if (parent.children[i].indeterminate) {parent.indeterminate = true;};
    }

    //Проверка статуса родеителя:
    //Выкл:
    if (parent.check == 0) {
      parent.status = false;
      parent.label.children[0].checked = false;
      parent.label.children[0].indeterminate = parent.indeterminate;

    //Частично:
    } else if (parent.check < parent.children.length) {
      parent.status = false;
      parent.label.children[0].indeterminate = true;
      parent.label.children[0].checked = false;
    //Вкл:
    } else {
      parent.status = true;
      parent.label.children[0].indeterminate = false;
      parent.label.children[0].checked = true;
    }

    //Если у родителя есть родитель:
    if (parent.parent > 0) {parentCheck(parent)}
  }
}

let elemID = 0; //переменная для присвоения id для элементов
let elemsArray = []; //линейнй список всех элементов
let rootEl = new InterestsTree(); //создаем нулевой элемент

const interests = Array.from(document.querySelector(".interests").children[0].children);

//Перебор элементов верхнего уровня:
for (let i = 0; i < interests.length; i++) {
    new InterestsTree(interests[i], 0);
}

//Создаются обработчики на клик по элементам:
for (let i = 1; i < elemsArray.length; i++) {
  elemsArray[i].clickElem();
}


//console.log(elemsArray[0]);