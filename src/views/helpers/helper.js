var register = function (Handlebars) {
  var helpers = {
    getTypeAccountHelper: (e) => {
      switch (e) {
        case 0:
          return "Quản trị viên (Admin)";
        case 1:
          return "Học viên";
        case 2:
          return "Giáo viên";
      }
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
