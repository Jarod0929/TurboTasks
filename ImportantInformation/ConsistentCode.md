**Comments**
Using Javascript Docs

/**
 * Description
 * @params name {type} description of params
           name {type} description of params
 * @return description of returns
 */

**Number of Spaces = 2**

**If Else Statements**
if (condition){
  //Code
} else if (condition2){
  //Code
} else {
  //Code
}

**Format of js file**
Imports
- React
- Tags
- packages
- styles
Global Variables and Functions
Main Export Function
Other Function
- TopBar
- ...

**Format of Components**
States
- UseStates
- UseEffects
Functions (Top to Down)
Return

**Main Component**
export function MainComponentName (params){
  //Code
}

**Other Component**
const ComponentName (params){
  //Code
}

**Functions within Components**
const functionName = (params, moreParams) => {
  //Code
};

Functions with only one params should be without parenthesis
const functionName = props => {

};

**UseEffects** 
//Only one function
useEffect(() => {
  functionName();
},[Something]);

**params**
({ variable })

**Equals Spacing**
variable = value