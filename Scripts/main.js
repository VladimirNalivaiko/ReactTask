'use strict'

var Rule = function (value) {
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

Rule.prototype.setValue = function (value) {
    this.value = value;
}

Rule.prototype.isRequired = function () {
    if (!this.isRequiredFlag) {
        this.functionList.append(this.isRequired);
        this.isRequiredFlag = true;
        return this;
    }
    var a = this.value;
    var ruleResult = {
        error : "Value must be different from " + a,
        value : a ? true : false
    }
    return ruleResult;
}

Rule.prototype.min = function (value) {
    var a = this.value;
    var b = this.minFlag;
    if (!this.minFlag) {
        this.functionList.append(this.min);
        this.minFlag = value;
        return this;
    }
    
    var ruleResult = {
        error : "Value must be greater than " + b,
        value : a >= b ? true : false
    }
    return ruleResult;
}

Rule.prototype.max = function (value) {
    var a = this.value;
    var b = this.maxFlag;
    if (!this.maxFlag) {
        this.functionList.append(this.max);
        this.maxFlag = value;
        return this;
    }
    
    var ruleResult = {
        error : "Value must be less than " + b,
        value : a <= b ? true : false
    }
    return ruleResult;
}

Rule.prototype.maxLength = function (value) {
    var a = this.value;
    var b = this.maxLengthFlag;
    if (!this.maxLengthFlag) {
        this.functionList.append(this.maxLength);
        this.maxLengthFlag = value;
        return this;
    }
    var ruleResult = {
        error : "Length must be less than " + b,
        value : a.length <= b ? true : false
    }
    return ruleResult;
}

Rule.prototype.minLength = function (value) {
    var a = this.value;
    var b = this.minLengthFlag;
    if (!this.minLengthFlag) {
        this.functionList.append(this.minLength);
        this.minLengthFlag = value;
        return this;
    }
    var ruleResult = {
        error : "Length must be greater than " + b,
        value : a.length >= b ? true : false
    }
    return ruleResult;
}

Rule.prototype.isInt = function () {
    var a = this.value;
    if (!this.isIntFlag) {
        this.functionList.append(this.isInt);
        this.isIntFlag = true;
        return this;
    }
    var ruleResult = {
        error : "It nust be a number",
        value : !isNaN(parseFloat(a)) && isFinite(a)
    }
    return ruleResult;
}

Rule.prototype.isEmail = function () {
    var a = this.value;
    if (!this.isEmailFlag) {
        this.functionList.append(this.isEmail);
        this.isEmailFlag = true;
        return this;
    }
    var emailReg = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z0-9]*\.[a-z]+(\.[a-z]+)?$/;
    var ruleResult = {
        error : "It must be an email",
        value : emailReg.test(a)
    }
    return ruleResult;
}

var Validator = function () {

}

Validator.validate = function (obj, rules) {
    var properties = Object.getOwnPropertyNames(obj);
    var propToRule = Object.getOwnPropertyNames(rules);
    for (var i = 0; i < properties.length; i++) {
        rules[propToRule[i]].value = obj[properties[i]];
    }
    for (var i = 0; i < properties.length; i++) {
        var rule = rules[properties[i]];
        for (var j = 0; j < rule.functionList.length; j++) {
            var result = rule.functionList.at(j).data.call(rule);
            if (!result.value) {
                return new Promise((resolve, reject) => {
                    reject(result.error);
                })
            }
        }
    }
    return new Promise((resolve, reject) => {
        resolve("Good")
    })
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
    age: new Rule().min(12)
};

var loginValidationRules = {
    password: new Rule().isRequired().isInt(),
    email: new Rule().isRequired().minLength(6).isEmail()
};

var validationPromise1 = Validator.validate(person1, personValidationRules)
    .then(
    result => {
        console.log(result)
    },
    error => {
        console.log(error)
    }
    )



// var validationPromise2 = Validator.validate(person2, personValidationRules);
// var validationPromise3 = Validator.validate(login, loginValidationRules);
// console.log("person1 validate = " + validationPromise1);
// console.log("person2 validate = " + validationPromise2);
// console.log("login validate = " + validationPromise3);

