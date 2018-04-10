var falcon9 = JSON.parse('{"Name":"Falcon 9","Stage 1":{"thrust":7607,"massInitial":421300,"massFinal":25600,"burnTime":162,"drag":0.25},"Stage 2":{"thrust":934,"massInitial":96570,"massFinal":3900,"burnTime":397,"drag":0.25}}');
console.log(falcon9);
var G = 6.67408E-11;
class Orbit
{
	constructor(apogee, period,idealVelocity)
	{
		this.apogee = apogee;
		this.period = period;
		this.idealVelocity = idealVelocity;
	}
	findIdealVelocity(height, planet)
	{
		var heightFromCentre = planet.radius + height;
		var orbitalCircumference = 2 * (heightFromCentre) * Math.PI;
		var timePeriod = 2 * Math.PI * Math.pow((Math.pow(heightFromCentre, 3) / planet.stdGravitationalParameter), 0.5);
		var idealVelocity = orbitalCircumference / timePeriod;
		return idealVelocity;
	}
}
class Rocket
{
	constructor(planet)
	{
		this.thrust = [];
		this.massInitial = [];
		this.massFinal = [];
		this.burnTime = [];
		this.coefficientOfDrag = [];
		this.height = 0;
		this.hVelocity = 0;
		this.vVelocity = 0;
		this.totalMass = 0;
		this.currMass = 0;
		this.payloadMass = 0;
		this.rotation = 0;
		this.relativeGravity = 0;
		this.xPosition = 0;
		this.yPosition = planet.radius;
		this.xVelocity = 0;
		this.yVelocity = 0;
		this.xAcceleration = 0;
		this.yAcceleration = 0;
	}
	addStage(thrust, massInitial, massFinal, burnTime, coefficientOfDrag)
	{
		this.thrust.push(thrust);
		this.massInitial.push(massInitial);
		this.currMass += this.massInitial[this.massInitial.length - 1];
		this.totalMass += this.massInitial[this.massInitial.length - 1] ;
		this.massFinal.push(massFinal);
		this.burnTime.push(burnTime);
		this.coefficientOfDrag.push(coefficientOfDrag);
	}
}
class Planet
{
	constructor(speedAtEquator, mass, radius, g, stdGravitationalParameter)
	{
		this.speedAtEquator = speedAtEquator;
		this.mass = mass;
		this.radius = radius;
		this.g = g;
		this.stdGravitationalParameter = stdGravitationalParameter;

	}
}
function gravity(rocket, planet, relativeGravity)
{
	//console.log(rocket.currMass);
	return G * rocket.currMass * planet.mass * relativeGravity / Math.pow((planet.radius + rocket.height),2);
}
function airResistance(rocket)
{
	var standardPressure = 101.325e3;
	var standardTemp = 288.15;
	var surfaceGravity = 9.8067;
	var gasConstant = 8.31447;
	var tempLapseRate = 0.0065;
	var massOfAir = 0.02896;
	var pressure;
	var density = 0;
	var airResistance = 0;
	var airResistanceArray = [];
	var total = Math.sqrt(Math.pow(rocket.vVelocity, 2) + Math.pow(rocket.hVelocity, 2));
	//Declare an array
	pressure = standardPressure * Math.pow(1 - (tempLapseRate * rocket.height) / standardTemp, (surfaceGravity * massOfAir) / (gasConstant * tempLapseRate));
	//console.log("Air Pressure: {0}", pressure);
	var specificGasConstant = gasConstant / massOfAir;
	density = pressure / (specificGasConstant * 273); //Using 273 in place of current temperature
	airResistance = rocket.coefficientOfDrag * density * Math.pow(total, 2) * Math.PI * Math.pow(5.2, 2) / 2;
	airResistanceArray.push(Math.cos(rocket.rotation) * airResistance);
	airResistanceArray.push(Math.sin(rocket.rotation) * airResistance);
}
function main(rocketInput)
{
	reset();
	var planet = new Planet(465.1, 5.972e24, 6371e3, 9.81, 3.986e14);
	var rocket = new Rocket(planet);
	var num = Object.keys(rocketInput).length-1;
	var r = rocketInput;
	for(var i = 1; i<=num;i++)
	{
		var s = "Stage " + i;
		console.log(r[s]["massInitial"]);
		rocket.addStage(r[s]["thrust"], r[s]["massInitial"], r[s]["massFinal"], r[s]["burnTime"], r[s]["drag"]);
	}
	console.log(rocket);
	//rocket.addStage(7607, 421300, 25600, 162, 0.25);
	//rocket.addStage(934, 96570, 3900, 397, 0.25);
	console.log(planet["radius"]);
	canvasScale = (canvas.height * 0.3) / planet.radius;
	console.log(canvasScale);
	findOrbitHeight(rocket, planet);
}
function findOrbitHeight(rocket, planet)
{
	var orbit = new Orbit(70000,0,0);

	console.log("started path");
	for(var i = 0;i<1;i++)
	{
		reset();
		ctx.moveTo(canvas.width*0.5, -canvas.height*0.2);
		ctx.beginPath();
		var height = stableOrbit(orbit, rocket, planet, 100);
		orbit["apogee"] = height;
		console.log("drawn");
		ctx.stroke();
		console.log("filled");
		console.log("apogee: " + orbit["apogee"]);
	}
	orbit["apogee"] = originalHeight;
	if(rocket.relativeGravity<=0.01)
	{
		drawOrbit(rocket,planet);
	}
	else
	{
		finishArc(rocket,100, planet);
	}
	
	/*
	
	console.log("apogee: " + orbit["apogee"]);
	reset();
	height = stableOrbit(orbit, rocket, planet, 100);
	*/
	
}
function stableOrbit(orbit, rocket, planet, frequencyOfCalc)
{
	var count = rocket.burnTime.length;
	var toApogee;
	
	console.log(count)
	for(var stage = 0;stage<count; stage++)
	{
		var remainingBurnTime = 0;
		for(i = 0;i<rocket.burnTime.length;i++)
		{
			remainingBurnTime += rocket.burnTime[i] * frequencyOfCalc;
		}
		for (i = 0; i < rocket.burnTime[0] * frequencyOfCalc; i++)
		{
			toApogee = Math.pow(rocket.vVelocity, 2) / 19.6;
			remainingBurnTime-= 1;


			//Use grav field equations
			requiredImpulse = planet.g * rocket.currMass * (orbit.apogee - rocket.height - toApogee)
			

			var impulsePerSecond = requiredImpulse * frequencyOfCalc / remainingBurnTime;
			var idealVelocity = orbit.findIdealVelocity(rocket.height, planet);
			var finalIdealVelocity = orbit.findIdealVelocity(orbit.apogee, planet);
			var requiredHorizontalImpulse = (finalIdealVelocity - rocket.hVelocity) * rocket.currMass;
			var theta;
			rocket.relativeGravity = 1 - (rocket.hVelocity / idealVelocity);


			//Uses old system of modelling gravity, should update
			theta = Math.PI/2 - Math.atan(rocket.relativeGravity * planet.g * rocket.currMass * (remainingBurnTime/frequencyOfCalc) / requiredHorizontalImpulse); //need to account for gravity
			

			if(theta<0)
			{
				theta = 0;
			}
			else if(theta>Math.PI/2)
			{
				theta = Math.PI;
			}
			if(rocket.height > orbit.apogee && rocket.vVelocity >= 0)
			{
				theta = Math.PI / 2;
				if(rocket.relativeGravity < 0)
				{
					theta = 0;
				}
			}
			if(rocket.height<10000)
			{
				rocket.rotation = 0;
			}
			else
			{
				rocket.rotation = theta;
			}
			airResistance(rocket);
			var resultantUp = (Math.cos(rocket.rotation) * rocket.thrust[0] * 1000) - gravity(rocket, planet,  rocket.relativeGravity);
			var resultantSideways = (Math.sin(rocket.rotation) * rocket.thrust[0] * 1000);
			rocket.currMass -= (rocket.massInitial[0] - rocket.massFinal[0]) / (rocket.burnTime[0] * frequencyOfCalc);
			

			//Change this section to accurately use XY co-ordinates from the resultant forces
			var vAcceleration = resultantUp / rocket.currMass;
			var hAcceleration = resultantSideways / rocket.currMass;
			rocket.vVelocity += vAcceleration / frequencyOfCalc;
			rocket.hVelocity += hAcceleration / frequencyOfCalc;
			rocket.height += rocket.vVelocity /frequencyOfCalc;


			if(i % 20 == 0)
			{
				draw(rocket, frequencyOfCalc/20,planet);
			}
		}
		console.log("Stage Seperation");
	}
	console.log("Burn Complete");
	console.log(rocket.height);
	return rocket.height;
}

function drawOrbit(rocket,planet)
{
	ctx.moveTo(canvas.width*0.5, canvas.height * -0.5);
	ctx.beginPath();
	ctx.arc(0, 0, canvas.height * 0.3 + canvasScale * rocket.height, 0,Math.PI * 2);
	ctx.stroke();
}
function finishArc(rocket, frequencyOfCalc, planet)
{
	ctx.beginPath();
	while(rocket.height>0)
	{

		var resultantUp = 0 - gravity(rocket, planet, rocket.relativeGravity);
		var vAcceleration = resultantUp / rocket.currMass;
		rocket.vVelocity += vAcceleration / frequencyOfCalc;
		rocket.height += rocket.vVelocity /frequencyOfCalc;
		if(i % 20 == 0)
		{
			//console.log(rocket.height);
			draw(rocket, frequencyOfCalc/20, planet);
		}
		
	}
	ctx.stroke();
}





var canvasScale;
//main();
var originalHeight = 70000;