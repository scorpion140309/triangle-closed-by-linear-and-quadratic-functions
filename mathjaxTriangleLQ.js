// mathjax_equations.js

//
const factorial = (aValue) => {
	if (n <= 1) return 1;
	return n * factorial_recursion(n - 1);
};
//
function makeFomulraRootAndPrimeFactors(aPrimeFactorsCount) {
	let retStrFomulra = "= \\sqrt{";
	const factors = [];
	for (const factor in aPrimeFactorsCount) {
		if (aPrimeFactorsCount[factor] === 1) {
			factors.push(factor);
		} else {
			factors.push(factor + "^{" + aPrimeFactorsCount[factor] + "}");
		}
	}
	retStrFomulra += factors.join(" \\times ");
	retStrFomulra += "}";
	return retStrFomulra;
}

//
function makeFomrulaRefined(aPrimeFactorsCount)
{
	let retStrFormula = "";
	const factors = [];
	let valueOuter = 1;
	let valueInner = 1;
	for (let factor in aPrimeFactorsCount) {
		const outN = parseInt(aPrimeFactorsCount[factor] / 2);
		const inN = aPrimeFactorsCount[factor] % 2;
		if (outN > 0) {
			valueOuter *= factor ** outN;
		}
		if (inN > 0) {
			valueInner *= factor ** inN;
		}
	}
	if (valueInner === 1) {
		retStrFormula = "= " + valueOuter;
	} else {
		retStrFormula = "= " + valueOuter + "\\sqrt{" + valueInner + "}";
	}
	return retStrFormula;
}

//
function makeFomulraQuadratic(aCoefA) {
	let retStrFormula = "Curve : y = a x^{2} =";
	switch (aCoefA)
	{
	case -1:
		retStrFormula += " - x^{2}";
		break;
	case 1:
		retStrFormula += " x^{2}";
		break;
	default:
		retStrFormula += aCoefA + "x^{2}";
		break;
	}
	return retStrFormula;
}

//
function makeFomulraLinear0(aCoefA, aXp, aXq, aFlagDispAns) {
	let retStrFormula = "";

	const slope = aCoefA * (aXp + aXq);
	const intersection = - aCoefA * aXp * aXq;

	if (aFlagDispAns) {
		switch (slope)
		{
		case -1:
			retStrFormula = "Line : y = b x + c = - x ";
			break;
		case 1:
			retStrFormula = "Line : y = b x + c = x ";
			break;
		default:
			retStrFormula = "Line : y = b x + c = " + slope + " x ";
			break;
		}
		//
		if (intersection < 0)
		{
			retStrFormula +=  " " + intersection;
		}
		else if (intersection > 0)
		{
			retStrFormula += " + " + intersection;
		}
	}
	else {
			retStrFormula = "Line : y = b x + c = ";
	}
	return retStrFormula;
}

//
function makeFomulraLinear1(aCoefA, aXp, aXq, aFlagDispAns) {
	let retStrFormula = "";
	if (aFlagDispAns) {
		//@@@
		retStrFormula += "\\because b = a (p + q), c = - a p q";
	}
	return retStrFormula;
}
//
function makeFomulraTriangle0(aFlagDispAns) {
	let retStrFormula = "";

	if (aFlagDispAns) {
		retStrFormula = "\\triangle ABC = \\frac{1}{2} \\times OC \\times (q - p)";
	}
	else {
		retStrFormula = "\\triangle ABC = ";
	}

	return retStrFormula;
}

//
function makeFomulraTriangle1(aCoefA, aXp, aXq, aFlagDispAns) {
	let retStrFormula = "";

	const base = Math.abs(- aCoefA * aXp * aXq);
	const height = aXq - aXp;
	const triangle = 0.5 * base * height;
	if (aFlagDispAns) {
		retStrFormula = "= \\frac{1}{2} \\times "+ base + "\\times (" + aXq + " - (" + aXp + ")) = " + triangle;
	}
	return retStrFormula;
}


//
function generateMathJax(aA, aXp, aXq, aFlagDispAns) {
	// Guideance
	const  strFomulaGuideance = makeFomulraQuadratic(aA);
	// Anser (upper)
	const strFormulaLinear0 = makeFomulraLinear0(aA, aXp, aXq, aFlagDispAns);
	const strFormulaLinear1 = makeFomulraLinear1(aA, aXp, aXq, aFlagDispAns);
	//
	const strTriangleArea0 = makeFomulraTriangle0(aFlagDispAns);
	const strTriangleArea1 = makeFomulraTriangle1(aA, aXp, aXq, aFlagDispAns);

	// display fomulas
	let equationContainer = document.getElementById('equationContainer');
	equationContainer.innerHTML = `
		<span class="equation">\\[ ${strFomulaGuideance}\\]</span>
		<span class="equation">\\[ ${strFormulaLinear0}\\]</span>
		<span class="equation">\\[ ${strFormulaLinear1}\\]</span>
		<span class="equation">\\[ ${strTriangleArea0}\\]</span>
		<span class="equation">\\[ ${strTriangleArea1}\\]</span>
	`;

	// render
	MathJax.typeset();
	
	equationContainer.style.display = 'inline-block';
}
