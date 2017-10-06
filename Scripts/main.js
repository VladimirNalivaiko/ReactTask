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
        return this;
    }
    return this.value ? true : false;
}

Rule.prototype.min = function(value){
    if(!this.minFlag){
        this.functionList.append(this.min);
        this.minFlag = value;
        return this;
    }
    return this.value >= this.minFlag ? true : false;
}

Rule.prototype.max = function(value){
    if(!this.maxFlag){
        this.functionList.append(this.max);
        this.maxFlag = value;
        return this;
    }
    return this.value <= this.maxFlag ? true : false;
}

Rule.prototype.maxLength = function(value){
    if(!this.maxLengthFlag){
        this.functionList.append(this.maxLength);
        this.maxLengthFlag = value;
        return this;
    }
    return this.value.length <= this.maxLengthFlag ? true : false;
}

Rule.prototype.minLength = function(value){
    if(!this.minLengthFlag){
        this.functionList.append(this.minLength);
        this.minLengthFlag = value;
        return this;
    }
    return this.value.length >= this.minLengthFlag ? true : false;    
}

Rule.prototype.isInt = function(){
    if(!this.isIntFlag){
        this.functionList.append(this.isInt);
        this.isIntFlag = true;
        return this;
    }
    return !isNaN(parseFloat(this.value)) && isFinite(this.value);
}

Rule.prototype.isEmail = function(){
    if(!this.isEmailFlag){
        this.functionList.append(this.isEmail);
        this.isEmailFlag = true;
        return this;
    }
    var emailReg = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z0-9]*\.[a-z]+(\.[a-z]+)?$/;
    return emailReg.test(this.value);
}

var Validator = function(){

}

Validator.validate = function(obj, rules){
    var properties = Object.getOwnPropertyNames(obj);
    var propToRule = Object.getOwnPropertyNames(rules);
    for(var i = 0; i < properties.length; i++){
        rules[propToRule[i]].value = obj[properties[i]];
    }
    for(var i = 0; i < properties.length; i++){
        var rule = rules[properties[i]];
        for(var j = 0; j < rule.functionList.length; j++){
            if(!rule.functionList.at(j).data.call(rule)){
                return false;
            }
        }
    }
    return true;
}

var person1 = {
    name: "Vova",
    age: 22
};
var person2 = {
    name: "Igor",
    age: 7
};
var login = {
    password: "123456",
    email: "email@gmail.com"
}

var personValidationRules = { 
    name: new Rule().isRequired().minLength(3).maxLength(10), 
    age: new Rule().min(9) 
};

var loginValidationRules = { 
    password: new Rule().isRequired().isInt(), 
    email: new Rule().isRequired().minLength(6).isEmail()
};

var validationPromise1 = Validator.validate(person1, personValidationRules);
var validationPromise2 = Validator.validate(person2, personValidationRules);
var validationPromise3 = Validator.validate(login, loginValidationRules);
console.log("person1 validate = " + validationPromise1);
console.log("person2 validate = " + validationPromise2);
console.log("login validate = " + validationPromise3);

