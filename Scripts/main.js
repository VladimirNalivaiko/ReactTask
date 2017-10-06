'use strict'

var Rule = function(value){
    this.value = value;
    this.functionList = new List();
    this.isRequiredFlag = null;
    this.maxLengthFlag = null;
    this.minLengthFlag = null;
    this.maxFlag = null;
    this.minFlag = null;
    this.isEmailFlag = null;
    this.isIntFlag = null;
}

Rule.prototype.setValue = function(value){
    this.value = value;
}

Rule.prototype.isRequired = function(){
    if(!this.isRequiredFlag){
        this.functionList.append(this.isRequired);
        this.isRequiredFlag = true;
    }
    // if(this.right){
    //     if(this.value){
    //         this.right = true;
    //     }else{
    //         this.right = false;
    //     }
    // }
    console.log("ISREQUIRED");
    return this;
}

Rule.prototype.min = function(value){
    if(!this.minFlag){
        this.functionList.append(this.min);
        this.minFlag = value;
    }
    return this;
}

Rule.prototype.max = function(value){
    if(!this.minFlag){
        this.functionList.append(this.min);
        this.minFlag = value;
    }
    this.max = value;
    return this;
}

Rule.prototype.maxLength = function(value){
    if(!this.maxLengthFlag){
        this.functionList.append(this.maxLength);
        this.maxLengthFlag = value;
    }
    this.maxLength = value;
    return this;
}

Rule.prototype.minLength = function(value){
    if(!this.minLengthFlag){
        this.functionList.append(this.minLength);
        this.minLengthFlag = value;
    }
    // if(this.right){
    //     console.log("minLength = " + this.value.length > value ? true : false);
    //     this.right = this.value.length > value ? true : false;
    // }
    console.log("MINLENGTH");
    return this;
}

Rule.prototype.isInt = function(value){
    if(!this.isIntFlag){
        this.functionList.append(this.isInt);
        this.isIntFlag = value;
    }
    return Number.isInteger(value);
}

Rule.prototype.isEmail = function(email){
    if(!this.isEmailFlag){
        this.functionList.append(this.isEmail);
        this.isEmailFlag = value;
    }
    var emailReg = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return emailReg.test(email);
}

var Validator = function(){

}

Validator.validate = function(obj, rules){
    var properties = Object.getOwnPropertyNames(obj);
    var propToRule = Object.getOwnPropertyNames(rules);//validationRules(name,age) 
    console.log(obj);
    console.log(rules);
    for(var i = 0; i < properties.length; i++){
        console.log(obj[i]);
        rules[propToRule[i]].value = obj[properties[i]];
        console.log(obj[properties[i]]);
    }
    console.log(rules);
    for(var i = 0; i < properties.length; i++){
        rules[i];
    }
    console.log(rules);
}

var person1 = {
    name: "Vova",
    age: 22
};
var person2 = {
    name: "Igor",
    age: 10
};

var personValidationRules = { 
    name: new Rule().isRequired().minLength(3).maxLength(10).isRequired(), 
    age: new Rule().min(10) 
};

var validationPromise = Validator.validate(person1, personValidationRules);

