const config = {
	colors: [
		// spark possible colors
		"#eddc01",
		"#f2b125",
		"#fd9407",
		"#ff7308",
		"#eb5508",
		"#fe1a17",
		"#e93702"
	],
	sizes: [4, 6, 8], // diameter in px
	minimalDistance: 20, // minimal distance between spawned
	gravitation: 0.2,
	airResistance: 0.98,
	shrink: 0.1
};

//? store coordinates of the prev and last generated spark
var prev = { x: 0, y: 0 },
	last = { x: 0, y: 0 };

//? cash frequantly used elements
const $body = $("body");
const $document = $(document);

const appendElement = (el) => $body.append(el),
	removeElement = (el) => setTimeout(() => $(el).remove());

//? pick random element in defined range from array
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1) + min),
	pickRandom = (arr) => arr[rand(0, arr.length - 1)];

const calcDistance = (a, b) =>
	Math.floor(Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2));

const calcAngleRadians = (startPoint, endPoint) =>
	Math.atan2(startPoint.y - endPoint.y, endPoint.x - startPoint.x);

const updateCoords = (position) => {
	//? update position of prev generated spark
	prev.x = last.x;
	prev.y = last.y;
	//? and the last spark
	last.x = position.x;
	last.y = position.y;
};

const generateSpeed = () => {
	var angle = (Math.random() * 360 * Math.PI) / 180; //? random angle in radians
	var speed = Math.random() * 2 + 1; //? random speed

	//? additional speed that depends on the speed and direction of mouse movement
	var addSpeed = (calcDistance(prev, last) / config.minimalDistance) * 2;
	var addSpeedY = addSpeed * Math.sin(calcAngleRadians(prev, last));
	var addSpeedX = addSpeed * Math.cos(calcAngleRadians(prev, last));

	//? output X and Y axis speeds
	var speedY = speed * Math.sin(angle) + addSpeedY;
	var speedX = speed * Math.cos(angle) + addSpeedX;

	return { speedX, speedY };
};

const animateSpark = (spark) => {
	//? constants for physically realistic animation
	var { speedX, speedY } = generateSpeed();
	const gravitation = config.gravitation;
	const airResistance = config.airResistance;
	const shrink = config.shrink;

	function animate() {
		spark.css({
			top: "-=" + speedY,
			left: "+=" + speedX,
			width: "-=" + shrink,
			height: "-=" + shrink
		});
		//? gravitation imitation
		speedY -= gravitation;
		//? air resistance imitation
		speedX *= airResistance;

		//? if a spark is beyond the page or its size is smaller than 0
		if (
			$(spark).top > $(window).height ||
			$(spark).left < 0 ||
			$(spark).width() <= 0
		) {
			removeElement(spark);
		} else {
			requestAnimationFrame(animate);
		}
	}
	animate();
};

const createSpark = (position) => {
	const spark = $("<div></div>");
	const size = pickRandom(config.sizes);
	spark.addClass("spark");
	spark.append(`<div class="spark-glow"></div>`);
	$(spark).css({
		left: position.x,
		top: position.y,
		background: pickRandom(config.colors),
		width: size,
		height: size
	});

	animateSpark(spark);
	appendElement(spark);

	updateCoords(position);
};

$document.mousemove((e) => {
	const position = {
		x: e.clientX,
		y: e.clientY
	};
	if (calcDistance(last, position) > config.minimalDistance)
		createSpark(position);
});
