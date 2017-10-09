'use strict'

var Rule = function (value) {
    this.value = value;
    this.functionArray = [];
}

Rule.prototype.setValue = function (value) {
    this.value = value;
}

Rule.prototype.isRequired = function () {
    this.functionArray.push(
        (function (ruleValue) {
            var ruleResult = {
                error: "Value must be different from " + ruleValue,
                value: ruleValue ? true : false
            }
            return ruleResult;
        })
    );
    return this;
}

Rule.prototype.min = function (value) {
    var parametr = value;
    this.functionArray.push(
        (function (ruleValue) {
            var ruleResult = {
                error: "Value must be greater than " + parametr,
                value: ruleValue >= parametr ? true : false
            }
            return ruleResult;
        })
    );
    return this;
}

Rule.prototype.max = function (value) {
    var parametr = value;
    this.functionArray.push(
        (function (ruleValue) {
            var ruleResult = {
                error: "Value must be less than " + parametr,
                value: ruleValue <= parametr ? true : false
            }
            return ruleResult;
        })
    );
    return this;
}

Rule.prototype.maxLength = function (value) {
    var parametr = value;
    this.functionArray.push(
        (function (ruleValue) {
            var ruleResult = {
                error: "Length must be less than " + parametr,
                value: ruleValue.length <= parametr ? true : false
            }
            return ruleResult;
        })
    );
    return this;
}

Rule.prototype.minLength = function (value) {
    var parametr = value;
    this.functionArray.push(
        (function (ruleValue) {
            var ruleResult = {
                error: "Length must be greater than " + parametr,
                value: ruleValue.length >= parametr ? true : false
            }
            return ruleResult;
        })
    );
    return this;
}

Rule.prototype.isInt = function () {
    this.functionArray.push(
        (function (ruleValue) {
            var ruleResult = {
                error: "It nust be a number",
                value: !isNaN(parseFloat(ruleValue) && isFinite(ruleValue))
            }
            return ruleResult;
        })
    );
    return this;
}

Rule.prototype.isEmail = function () {
    this.functionArray.push(
        (function (ruleValue) {
            var emailReg = /^[a-z][a-zA-Z0-9_.]*(\.[a-zA-Z][a-zA-Z0-9_.]*)?@[a-z][a-zA-Z0-9]*\.[a-z]+(\.[a-z]+)?$/;
            var ruleResult = {
                error: "It must be an email",
                value: emailReg.test(ruleValue)
            }
            return ruleResult;
        })
    );
    return this;
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
        for (var j = 0; j < rule.functionArray.length; j++) {
            var result = rule.functionArray[j].call(rule, rules[propToRule[i]].value);
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

