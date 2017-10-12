'use strict'

var Rule = function (value) {
    this.value = value;
    this.functionArray = [];
}

Rule.prototype.isRequired = function () {
    this.functionArray.push(function (ruleValue) {
        var isValid = !!ruleValue || isInt(ruleValue);
        var message = "Value must be different from " + ruleValue;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.min = function (value) {
    this.functionArray.push(function (ruleValue, propertyName) {
        var isValid = ruleValue >= value;
        var message = propertyName + '(' + ruleValue + ')' + " must be greater than " + value;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.max = function (value) {
    this.functionArray.push(function (ruleValue, propertyName) {
        var isValid = ruleValue <= value;
        var message = propertyName + '(' + ruleValue + ')' + " must be less than " + value;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.maxLength = function (value) {
    this.functionArray.push(function (ruleValue, propertyName) {
        var isValid = ruleValue.length <= value;
        var message = propertyName + "'s(" + ruleValue + ')' + " length" + '('
            + ruleValue.length + ')' + " must be less than " + value;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.minLength = function (value) {
    this.functionArray.push(function (ruleValue, propertyName) {
        var isValid = ruleValue.length >= value;
        var message = propertyName + "'s(" + ruleValue + ')' + " length" + '('
            + ruleValue.length + ')' + " must be greater than " + value;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

var isInt = function(value){
    return !isNaN(parseFloat(value) && isFinite(value));
}

Rule.prototype.isInt = function () {
    this.functionArray.push(function (ruleValue, propertyName) {
        var isValid = isInt(ruleValue);
        var message = propertyName + '(' + ruleValue + ')' + " must be a number";
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.isEmail = function () {
    this.functionArray.push(function (ruleValue, propertyName) {
        var emailReg = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z0-9]*\.[a-z]+(\.[a-z]+)?$/;
        var isValid = emailReg.test(ruleValue);
        var message = propertyName + '(' + ruleValue + ')' + " must be an email";
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

var Validator = function () {

}

Validator.validate = function (obj, rules) {

    var propertiesForValidation = Object.getOwnPropertyNames(rules);
    var errorsArray = [];
    for(var item in propertiesForValidation){
        var propertyName = propertiesForValidation[item];
        var rule = rules[propertyName];
        var value = obj[propertyName];
        for (var j = 0; j < rule.functionArray.length; j++) {
            var result = rule.functionArray[j](value, propertyName);
            if (!result.isValid) {
                errorsArray.push(result.errorMessage)
            }
        }
    }
    return new Promise((resole, reject) => errorsArray.length === 0 ? resole(errorsArray) : reject(errorsArray));
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
    name: new Rule().isRequired().minLength(4).maxLength(8),
    age: new Rule().min(52)
};

var loginValidationRules = {
    password: new Rule().isRequired().isInt(),
    email: new Rule().isRequired().minLength(8).isEmail()
};

Promise.prototype.checkPromise = function () {
    this.then(
        result => {
            console.log(result)
        },
        error => {
            console.log(error)
        }
    )
}

var validationPromise1 = Validator.validate(person1, personValidationRules);
var validationPromise2 = Validator.validate(person2, personValidationRules);
var validationPromise3 = Validator.validate(login, loginValidationRules);
validationPromise1.checkPromise();
validationPromise2.checkPromise();
validationPromise3.checkPromise();

