//const opening = document.querySelector("#opening");
//const closing = document.querySelector("#closing");
const screen = document.getElementById("screen");
const AC = document.getElementById("clear");
const backspace = document.getElementById("backspace");
const equal = document.getElementById("equal");
const btns = document.querySelectorAll(".characters > div");

//turns to array of length 1
let stack = [screen.innerHTML];
const operators = ["%","/","*","-","+"];
let capturedNumbers = "";
let afterOperator = false;
let equaled = false;

let nums = [];

const bodmas = () => {
    if (nums.length === 3) return;

    let i = 1;
    let len = nums.length-2;

    while (i <= len) {
        if (nums[i] === "*") {
            const answer = Number(nums[i-1]) * Number(nums[i+1]);
            nums.splice(i-1, 3, answer);
            len -= 2;
        }
        else if (nums[i] === "/") {
            const answer = Number(nums[i-1]) / Number(nums[i+1]);
            nums.splice(i-1, 3, answer);
            len -= 2;
        }
        else i += 2;
    }
    return nums.length === 1 ? true : false;
}

const calculate = () => {
    if (nums.length === 1) return nums[0];

    if (!bodmas()) {

        let answer = 0;
        let len = nums.length;

        while (len > 1) {
            let i = 1;

            switch (nums[i]) {
                case "*":
                    answer = Number(nums[i-1]) * Number(nums[i+1]);
                    break;
                case "/":
                    answer= Number(nums[i-1]) / Number(nums[i+1]);
                    break;
                case "%":
                    answer = Number(nums[i-1]) % Number(nums[i+1]);
                    break;
                case "+":
                    answer= Number(nums[i-1]) + Number(nums[i+1]);
                    break;
                case "-":
                    answer = Number(nums[i-1]) - Number(nums[i+1]);
                    break;
            }
            nums.splice(i-1, 3, answer);
            len = nums.length;
        }
        return answer;
    }
    return nums[0];
}

const screen_btns = Array.from(btns).filter(item => !(item.classList.contains("bg")));

//screen_btns.push(opening);
//screen_btns.push(closing);

screen_btns.forEach(item => {
    item.addEventListener("click", () => {
        if (equaled) return;
        
        if (stack.length === 1 && stack[0] == "0") {
            if (item.classList.contains("nf")) return;

            if (item.innerHTML == ".") {
                stack.push(item.innerHTML);
                screen.innerHTML = stack.join("");
                capturedNumbers += stack.join("");
                return;
            }

            stack.pop();
            stack.push(item.innerHTML);
            capturedNumbers += item.innerHTML;
            screen.innerHTML = stack.join("");
            return;
        }
    
        if (stack.length >= 1) {
            const last = stack[stack.length-1];

            // if (last == "(" && item.innerHTML == ")") {
            //     return;
            // }

            if (operators.includes(item.innerHTML)) {
                if (operators.includes(last)) {
                    return;
                }
                stack.push(item.innerHTML);
                nums.push(capturedNumbers);
                nums.push(item.innerHTML);
                capturedNumbers = ""; 
            }
            else {
                capturedNumbers += item.innerHTML;
                stack.push(item.innerHTML);
            }
            screen.innerHTML = stack.join("");
        }
    });
});

AC.addEventListener("click", () => {
    screen.innerHTML = 0;
    stack = [0];
    nums = [];
    capturedNumbers = "";
    afterOperator = false;
    equaled = false;
});

backspace.addEventListener("click", () => {
    if (equaled) return;

    const lastStack = stack[stack.length-1];

    if (operators.includes(lastStack)) {
        nums.pop();
        afterOperator = true;
        capturedNumbers = nums[nums.length-1];
        nums.pop();
    }
    else {
        if (afterOperator) {
            afterOperator = false;
            nums.pop();
        }
        capturedNumbers = capturedNumbers.substr(0, capturedNumbers.length-1);
    }
    stack.pop();

    if (stack.length === 0) {
        screen.innerHTML = 0;
        stack = [0];
        return;
    }
    screen.innerHTML = stack.join("");
})

equal.addEventListener("click", () => {
    if (equaled) return;

    if (operators.includes(stack[stack.length-1])) {
        screen.innerHTML = "Invalid input";
        return;
    }

    nums.push(capturedNumbers);
    screen.innerHTML = calculate();
    equaled = true;
})