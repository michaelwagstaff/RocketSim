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
	constructor()
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
function gravity(rocket, relativeGravity)
{
	console.log(rocket.currMass);
	return rocket.currMass * 9.81 * relativeGravity;
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
function main()
{
	console.log("Stuff");
	var rocket = new Rocket();
	console.log(rocket.rotation	);
	rocket.addStage(7607, 421300, 25600, 162, 0.25);
	rocket.addStage(934, 96570, 3900, 397, 0.25);
	var planet = new Planet(465.1, 5.972e24, 6371e3, 3.986e14);
	findOrbitHeight(rocket, planet)
}
function findOrbitHeight(rocket, planet)
{
	var orbit = new Orbit(70000,0,0);
	//stableOrbit(orbit, rocket, planet, 100);
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
			//console.log(remainingBurnTime);
			requiredImpulse = planet.g * rocket.currMass * (orbit.apogee - rocket.height - toApogee) //bad way of modelling this
			/* Either:
			- replace requiredImpulse calculation
			- fix mass term
			- calculate horizontal inpulse required in a similar way and find proper angle
			*/
			var impulsePerSecond = requiredImpulse * frequencyOfCalc / remainingBurnTime;
			//Again I don't think this term is quite right
			var idealVelocity = orbit.findIdealVelocity(rocket.height, planet);
			var requiredHorizontalImpulse = (idealVelocity - rocket.hVelocity) * rocket.currMass;
			var theta;
			var relativeGravity = 1 - (rocket.hVelocity / idealVelocity)

			theta = requiredImpulse / requiredHorizontalImpulse;

			//Calculate theta here based on parameters
			airResistance(rocket);
			//console.log(idealVelocity);
			//console.log(Math.cos(rocket.rotation) * rocket.thrust[0] * 1000 - gravity(rocket, relativeGravity));
			var resultantUp = (Math.cos(rocket.rotation) * rocket.thrust[0] * 1000) - gravity(rocket, relativeGravity);
			var resultantSideways = (Math.sin(rocket.rotation) * rocket.thrust[0] * 1000);
			rocket.currMass -= (rocket.massInitial[0] - rocket.massFinal[0]) / (rocket.burnTime[0] * frequencyOfCalc);
			var vAcceleration = resultantUp / rocket.currMass;
			var hAcceleration = resultantSideways / rocket.currMass;
			rocket.vVelocity += vAcceleration / frequencyOfCalc;
			rocket.hVelocity += hAcceleration / frequencyOfCalc;
		}
	}
	console.log("Done");

}








main();