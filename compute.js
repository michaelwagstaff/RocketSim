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
		var timePeriod = 2 * Math.PI * Math.Pow((Math.Pow(heightFromCentre, 3) / stdGravitationalParameter), 0.5);
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
		this.radius = radius
		this.g = g;
		this.stdGravitationalParameter = stdGravitationalParameter

	}
}
function main()
{
	console.log("Stuff");
	var rocket = new Rocket();
	rocket.addStage(7607, 421300, 25600, 162, 0.25);
	rocket.addStage(934, 96570, 3900, 397, 0.25);
	var planet = new Planet(465.1, 5.972e24, 6371e3, 3.986e14);
	findOrbitHeight(rocket, planet)
}
function findOrbitHeight(rocket, planet)
{
	var orbit = new Orbit(70000,0,0);
	stableOrbit(orbit, rocket, planet, 100);
}
function stableOrbit(orbit, rocket, planet, frequencyOfCalc)
{
	var count = rocket.burnTime.length;
	var toApogee;
	
	console.log(count)
	for(var stage = 0;stage<count; stage++)
	{
		var remainingBurnTime = 0;
		for(i = 0;i<count;i++)
		{
			//Will break on second stage
			remainingBurnTime += rocket.burnTime[i] * frequencyOfCalc;
		}
		for (i = 0; i < rocket.burnTime[0] * frequencyOfCalc; i++)
		{
			console.log(i);
			toApogee = Math.Pow(rocket.vVelocity, 2) / 19.6;
			remainingBurnTime-= 1;
			console.log(remainingBurnTime);
			requiredImpulse = planet.g * rocket.currMass * (orbit.apogee - rocket.height - toApogee) //bad way of modelling this
			/* Either:
			- replace requiredImpulse calculation
			- fix mass term
			- calculate horizontal inpulse required in a similar way and find proper angle
			*/
			var impulsePerSecond = requiredImpulse * frequencyOfCalc / remainingBurnTime;
			//Again I don't think this term is quite right
			var idealVelocity = orbit.findIdealVelocity(rocket.height, planet);
			var theta;

			//Calculate theta here based on parameters


			console.log(idealVelocity);



		}
	}

}
main();