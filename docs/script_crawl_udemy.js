let tag_course_name =
  ".udlite-focus-visible-target.udlite-heading-md.course-card--course-title--2f7tE";
let tag_course_overview = ".udlite-text-sm.course-card--course-headline--yIrRk";
let tag_price_discount =
  ".price-text--price-part--Tu6MH.course-card--discount-price--3TaBk.udlite-heading-md span:nth-child(2)";
let tag_price_origin =
  ".price-text--price-part--Tu6MH.price-text--original-price--2e-F5.course-card--list-price--2AO6G.udlite-text-sm span:nth-child(2)";

let parse_field = (tagClassName) => {
  let tag_course_name = document.querySelectorAll(tagClassName);
  tag_course_name = Array.prototype.map.call(tag_course_name, (item) => {
    if (item != "") {
      return item.innerText;
    } else {
      return "not";
    }
  });
  tag_course_name = Array.prototype.filter.call(
    tag_course_name,
    (item) => item !== ""
  );
  return tag_course_name;
};
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

let tag_image =
  ".course-card--course-image--2sjYP.browse-course-card--image--35hYN";
//.course-card--course-image--2sjYP .browse-course-card--image--35hYN
//.course-card--course-image--2sjYP .browse-course-card--image--35hYN
let parse_img = (tagClassNameImg) => {
  let tag_course_name = document.querySelectorAll(tagClassNameImg);
  tag_course_name = Array.prototype.map.call(tag_course_name, (item) => {
    if (item != "") {
      return item.src;
    } else {
      return "not";
    }
  });
  tag_course_name = Array.prototype.filter.call(
    tag_course_name,
    (item) => item !== ""
  );
  return tag_course_name;
};

let data = [];
let crawl_course = () => {
  course_names = parse_field(tag_course_name);
  course_overviews = parse_field(tag_course_overview);
  course_prices = parse_field(tag_price_origin);
  course_prices_discounts = parse_field(tag_price_discount);
  course_img = parse_img(tag_image);
  for (let i = 0; i < course_names.length; i++) {
    const item = {
      name: course_names[i],
      overview: course_overviews[i],
      thumbnail: course_img[i],
      description: "<b>Mô tả cho </b>" + i,
      price: parseFloat(course_prices[i] ? course_prices[i].substring(1) : course_prices_discounts[i].substring(1)),
      price_discount: parseFloat(course_prices[i] ? course_prices_discount[i].substring(1) : - 1),
      count_view: getRandomIntInclusive(0, 9999)
    };
    data.push(item);
  }
};
crawl_course();
console.log(JSON.stringify(data));
// console.log(parse_field(tag_course_name));
// console.log(parse_field(tag_course_overview));
// console.log(parse_field(tag_price_discount));
// console.log(parse_field(tag_price_origin));
//console.log(parse_img(tag_image));
