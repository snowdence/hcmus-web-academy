var register = function (Handlebars) {
  var helpers = {
    getTypeAccountHelper: (e) => {
      switch (e) {
        case 0:
          return "Administrator";
        case 1:
          return "Teacher";
        case 2:
          return "Student";
      }
    },
    pagination: function (currentPage, totalPage, size, options) {
      var startPage, endPage, context;

      currentPage = parseInt(currentPage) || currentPage;
      totalPage = parseInt(totalPage) || totalPage;
      size = parseInt(size) || size;
      if (arguments.length === 3) {
        options = size;
        size = 5;
      }

      startPage = currentPage - Math.floor(size / 2);
      endPage = currentPage + Math.floor(size / 2);

      if (startPage <= 0) {
        endPage -= startPage - 1;
        startPage = 1;
      }

      if (endPage > totalPage) {
        endPage = totalPage;
        if (endPage - size + 1 > 0) {
          startPage = endPage - size + 1;
        } else {
          startPage = 1;
        }
      }

      context = {
        startFromFirstPage: false,
        pages: [],
        endAtLastPage: false,
      };
      if (startPage === 1) {
        context.startFromFirstPage = true;
      }
      for (var i = startPage; i <= endPage; i++) {
        context.pages.push({
          page: i,
          isCurrent: i == currentPage,
        });
      }
      if (endPage === totalPage) {
        context.endAtLastPage = true;
      }

      return options.fn(context);
    },
    compare: function (lvalue, operator, rvalue, options) {
      //compare hbs sipport
      var operators, result;

      if (arguments.length < 3) {
        throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
      }

      if (options === undefined) {
        options = rvalue;
        rvalue = operator;
        operator = "===";
      }

      operators = {
        "==": function (l, r) {
          return l == r;
        },
        "===": function (l, r) {
          return l === r;
        },
        "!=": function (l, r) {
          return l != r;
        },
        "!==": function (l, r) {
          return l !== r;
        },
        "<": function (l, r) {
          return l < r;
        },
        ">": function (l, r) {
          return l > r;
        },
        "<=": function (l, r) {
          return l <= r;
        },
        ">=": function (l, r) {
          return l >= r;
        },
        typeof: function (l, r) {
          return typeof l == r;
        },
      };

      if (!operators[operator]) {
        throw new Error(
          "Handlerbars Helper 'compare' doesn't know the operator " + operator
        );
      }

      result = operators[operator](lvalue, rvalue);

      if (result) {
        return options.fn(this);
      } else {
        return options.inverse(this);
      }
    },
    when: function (operand_1, operator, operand_2, options) {
      var operators = {
          "==": function (l, r) {
            return l == r;
          },
          "!=": function (l, r) {
            return l != r;
          },
          ">": function (l, r) {
            return Number(l) > Number(r);
          },
          "||": function (l, r) {
            return l || r;
          },
          "&&": function (l, r) {
            return l && r;
          },
          "%": function (l, r) {
            return l % r === 0;
          },
        },
        result = operators[operator](operand_1, operand_2);

      if (result) return options.fn(this);
      else return options.inverse(this);
    },
    clg: (obj) => {
      console.log("[DEBUG] " + obj);
    },
    isAdmin: (e) => {
      return e && e.role == 0;
    },
    runtime: (runtime) => {
      if (!runtime || !runtime > 0) {
        return "";
      }
      const hours = Math.floor(runtime / 60);
      const minutes = runtime % 60;

      return `${hours}h ${minutes}m`;
    },
    // put all of your helpers inside this object
    foo: function () {
      return "FOO";
    },
    bar: function () {
      return "BAR";
    },
    isEndRow: (num, total) => {
      if (num % 2 || num == total-1) return true
      else return false
    },
    isEqual: (a, b) =>{
      if(String(b) === String(a)) return true
      else return false
    },
    Prev: (a)=>{
      if (parseInt(a) == 1) return 1
      return parseInt(a) - 1
    },
    Next: (a, courses)=>{
      if (parseInt(a) == courses.length) return a
      return parseInt(a) + 1
    },
    //top course
    checkIndex: (index) => {
      if(index < 5) return true;
      return false;
    }
  };

  if (Handlebars && typeof Handlebars.registerHelper === "function") {
    // register helpers
    for (var prop in helpers) {
      Handlebars.registerHelper(prop, helpers[prop]);
    }
  } else {
    // just return helpers object if we can't register helpers here
    return helpers;
  }
};

module.exports.register = register;
module.exports.helpers = register(null);
