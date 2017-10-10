'use strict'

var Rule = function (value) {
    this.value = value;
    this.functionArray = [];
}

Rule.prototype.setValue = function (value) {
    this.value = value;
}

Rule.prototype.isRequired = function () {
    this.functionArray.push(function (ruleValue) {
        var isValid = ruleValue ? true : false;
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
    var parametr = value;
    this.functionArray.push(function (ruleValue, ruleName) {
        var isValid = ruleValue >= parametr ? true : false;
        var message = ruleName + '(' + ruleValue + ')' + " must be greater than " + parametr;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.max = function (value) {
    var parametr = value;
    this.functionArray.push(function (ruleValue, ruleName) {
        var isValid = ruleValue <= parametr ? true : false;
        var message = ruleName + '(' + ruleValue + ')' + " must be less than " + parametr;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.maxLength = function (value) {
    var parametr = value;
    this.functionArray.push(function (ruleValue, ruleName) {
        var isValid = ruleValue.length <= parametr ? true : false;
        var message = ruleName + "'s(" + ruleValue + ')' + " length" + '('
            + ruleValue.length + ')' + " must be less than " + parametr;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.minLength = function (value) {
    var parametr = value;
    this.functionArray.push(function (ruleValue, ruleName) {
        var isValid = ruleValue.length >= parametr ? true : false;
        var message = ruleName + "'s(" + ruleValue + ')' + " length" + '('
            + ruleValue.length + ')' + " must be greater than " + parametr;
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.isInt = function () {
    this.functionArray.push(function (ruleValue, ruleName) {
        var isValid = !isNaN(parseFloat(ruleValue) && isFinite(ruleValue));
        var message = ruleName + '(' + ruleValue + ')' + " must be a number";
        var validationResult = {
            errorMessage: isValid ? null : message,
            isValid: isValid
        }
        return validationResult;
    });
    return this;
}

Rule.prototype.isEmail = function () {
    this.functionArray.push(function (ruleValue, ruleName) {
        var emailReg = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z0-9]*\.[a-z]+(\.[a-z]+)?$/;
        var isValid = emailReg.test(ruleValue);
        var message = ruleName + '(' + ruleValue + ')' + " must be an email";
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
    var properties = Object.getOwnPropertyNames(obj);
    var propToRule = Object.getOwnPropertyNames(rules);
    var errorsArray = [];
    for (var i = 0; i < properties.length; i++) {
        rules[propToRule[i]].value = obj[properties[i]];
    }
    for (var i = 0; i < properties.length; i++) {
        var rule = rules[properties[i]];
        for (var j = 0; j < rule.functionArray.length; j++) {
            var result = rule.functionArray[j].call(rule, rules[propToRule[i]].value, propToRule[i]);
            if (!result.isValid) {
                errorsArray.push(result.errorMessage)
            }
        }
    }
    if (errorsArray.length === 0) {
        return new Promise((resolve, reject) => {
            resolve("Good")
        })
    } else {
        return new Promise((resolve, reject) => {
            reject(errorsArray)
        })
    }
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
    email: "email1gmail.com"
}

var personValidationRules = {
    name: new Rule().isRequired().minLength(4).maxLength(10),
    age: new Rule().min(12)
};

var loginValidationRules = {
    password: new Rule().isRequired().isInt(),
    email: new Rule().isRequired().minLength(116).isEmail()
};

Promise.prototype.checkPromise = function () {
    this.then(
        result => {
            console.log(result)
        },
        error => {
            error.map(item => { console.log(item) })
        }
    )
}

var validationPromise1 = Validator.validate(person1, personValidationRules);
var validationPromise2 = Validator.validate(person2, personValidationRules);
var validationPromise3 = Validator.validate(login, loginValidationRules);
validationPromise1.checkPromise();
validationPromise2.checkPromise();
validationPromise3.checkPromise();

