var falcon9 = JSON.parse('{"Name":"Falcon 9","numStages":"2","stockShip":"true","Stage 1":{"thrust":7607,"massInitial":421300,"massFinal":25600,"burnTime":162,"drag":0.25},"Stage 2":{"thrust":934,"massInitial":96570,"massFinal":3900,"burnTime":397,"drag":0.25}}');
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
		this.payloadMass = 5000;
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
function gravity(rocket, planet, pathfinding)
{
	var relativeGravity = 1;
	if(pathfinding)
	{
		relativeGravity = rocket.relativeGravity;
	}
	return G * rocket.currMass * planet.mass * relativeGravity / Math.pow((planet.radius + rocket.height),2);
}
function findAirResistance(rocket, stage)
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
	var airResistanceArray = {};
	var total = Math.sqrt(Math.pow(rocket.vVelocity, 2) + Math.pow(rocket.hVelocity, 2));
	//Declare an array
	pressure = standardPressure * Math.pow(1 - (tempLapseRate * rocket.height) / standardTemp, (surfaceGravity * massOfAir) / (gasConstant * tempLapseRate));
	var specificGasConstant = gasConstant / massOfAir;
	density = pressure / (specificGasConstant * 273); //Using 273 in place of current temperature
	airResistance = rocket.coefficientOfDrag[stage] * density * Math.pow(total, 2) * Math.PI * Math.pow(5.2, 2) / 2;
	if(isNaN(airResistance))
	{
		airResistance = 0;
	}
	airResistanceArray["vertical"] = Math.cos(rocket.rotation) * airResistance;
	airResistanceArray["horizontal"] = Math.sin(rocket.rotation) * airResistance;
	return airResistanceArray;
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
		rocket.addStage(r[s]["thrust"], r[s]["massInitial"], r[s]["massFinal"], r[s]["burnTime"], r[s]["drag"]);
	}
	console.log(rocket);
	canvasScale = (canvas.height * 0.3) / planet.radius;
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
		console.log("apogee: " + orbit["apogee"]);
	}
	orbit["apogee"] = originalHeight;
	finishArc(rocket,100, planet);
	ctx.stroke();
}
function stableOrbit(orbit, rocket, planet, frequencyOfCalc)
{
	var count = rocket.burnTime.length;
	var toApogee;
	
	console.log("Stages: " + count)
	for(var stage = 0;stage<count; stage++)
	{
		var remainingBurnTime = 0;
		rocket.currMass = rocket.payloadMass;
		for(i = stage;i<rocket.burnTime.length;i++)
		{
			rocket.currMass += rocket.massInitial[i];
			remainingBurnTime += rocket.burnTime[i] * frequencyOfCalc;
			console.log("Remaining Burn Time: " + remainingBurnTime);
		}
		for (i = 0; i < rocket.burnTime[stage] * frequencyOfCalc; i++)
		{
			toApogee = Math.pow(rocket.vVelocity, 2) / 19.6;
			if(rocket.vVelocity<0)
			{
				toApogee = -toApogee;
			}
			remainingBurnTime-= 1;


			//Use grav field equations
			requiredImpulse = (G * rocket.currMass * planet.mass / (rocket.height + toApogee + planet.radius)) - (G * rocket.currMass * planet.mass / (orbit.apogee + planet.radius));
			

			var impulsePerSecond = requiredImpulse * frequencyOfCalc / remainingBurnTime;
			var idealVelocity = orbit.findIdealVelocity(rocket.height, planet);
			var finalIdealVelocity = orbit.findIdealVelocity(orbit.apogee, planet);
			var requiredHorizontalImpulse = (finalIdealVelocity - rocket.hVelocity) * rocket.currMass;
			var theta;
			rocket.relativeGravity = 1 - (rocket.hVelocity / idealVelocity);

			var airResistance = findAirResistance(rocket, stage);
			//Only includes vertical impulse to counter gravity
			if(requiredImpulse < 0)
			{
				requiredImpulse = 0;
			}
			theta = Math.PI/2 - Math.asin((gravity(rocket,planet,true) + airResistance["vertical"] + requiredImpulse/(remainingBurnTime/frequencyOfCalc)) / (rocket.thrust[stage] * 1000));
			if(isNaN(theta))
			{
				theta = 0;
			}
			

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
					rocket.thrust[stage] = 0;
				}
			}
			/*
			if(rocket.height + toApogee < orbit.apogee && rocket.vVelocity < 0)
			{
				theta = 0;
			}
			*/
			if(rocket.height<10000)
			{
				rocket.rotation = 0;
			}
			else
			{
				rocket.rotation = theta;
			}
			var resultantUp = (Math.cos(rocket.rotation) * rocket.thrust[stage] * 1000) - gravity(rocket, planet, false) - airResistance["vertical"];
			var resultantSideways = (Math.sin(rocket.rotation) * rocket.thrust[stage] * 1000)  - airResistance["horizontal"];
			rocket.currMass -= (rocket.massInitial[stage] - rocket.massFinal[stage]) / (rocket.burnTime[stage] * frequencyOfCalc);
			

			//Change this section to accurately use XY co-ordinates from the resultant forces
			var vAcceleration = resultantUp / rocket.currMass;
			var hAcceleration = resultantSideways / rocket.currMass;
			rocket.yAcceleration = vAcceleration*Math.cos(canvasRotation) - hAcceleration * Math.sin(canvasRotation);
			rocket.xAcceleration = vAcceleration*Math.sin(canvasRotation) + hAcceleration * Math.cos(canvasRotation);
			
			rocket.xVelocity += rocket.xAcceleration / frequencyOfCalc;
			rocket.yVelocity += rocket.yAcceleration / frequencyOfCalc;

			rocket.xPosition += rocket.xVelocity / frequencyOfCalc;
			rocket.yPosition += rocket.yVelocity / frequencyOfCalc;

			rocket.vVelocity = rocket.yVelocity*Math.cos(canvasRotation) + rocket.xVelocity*Math.sin(canvasRotation);
			rocket.hVelocity = - rocket.yVelocity*Math.sin(canvasRotation) + rocket.xVelocity*Math.cos(canvasRotation);
			rocket.height = Math.sqrt(Math.pow(rocket.xPosition, 2) + Math.pow(rocket.yPosition, 2)) - planet.radius;


			if(i % 20 == 0)
			{
				draw(rocket, frequencyOfCalc/20,planet);
			}
		}
		console.log("Stage Seperation");
	}
	console.log("Burn Complete");
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
	if(rocket.vVelocity>100)
	{
		frequencyOfCalc /= 10;
	}
	for(var i = 0;i<100000;i++)
	{
		var resultantUp = 0 - gravity(rocket, planet, false);
		var vAcceleration = resultantUp / rocket.currMass;
		var hAcceleration = 0;
		rocket.yAcceleration = vAcceleration*Math.cos(canvasRotation);
		rocket.xAcceleration = vAcceleration*Math.sin(canvasRotation);

		rocket.xVelocity += rocket.xAcceleration / frequencyOfCalc;
		rocket.yVelocity += rocket.yAcceleration / frequencyOfCalc;

		rocket.xPosition += rocket.xVelocity / frequencyOfCalc;
		rocket.yPosition += rocket.yVelocity / frequencyOfCalc;

		rocket.vVelocity = rocket.yVelocity*Math.cos(canvasRotation) + rocket.xVelocity*Math.sin(canvasRotation);
		rocket.hVelocity = - rocket.yVelocity*Math.sin(canvasRotation) + rocket.xVelocity*Math.cos(canvasRotation);
		rocket.height = Math.sqrt(Math.pow(rocket.xPosition, 2) + Math.pow(rocket.yPosition, 2)) - planet.radius;
		if(i % 20 == 0)
		{
			draw(rocket, frequencyOfCalc/20, planet);
		}
	}
	ctx.stroke();
}





var canvasScale;
//main();
var originalHeight = 70000;