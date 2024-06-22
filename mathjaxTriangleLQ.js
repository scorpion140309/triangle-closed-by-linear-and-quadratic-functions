// mathjax_equations.js

//
const factorial = (aValue) => {
	if (n <= 1) return 1;
	return n * factorial_recursion(n - 1);
};

//
function gcd(a, b) {
	if (b === 0) {
		return a;
	}
	return gcd(b, a % b);
}

//
function convertToFraction(aNum) {
	let sign = Math.sign(aNum);
	aNum = Math.abs(aNum);
	
	let denominator = Math.pow(10, aNum.toString().split('.')[1]?.length || 0);
	let numerator = aNum * denominator;

	let divisor = gcd(numerator, denominator);
	numerator /= divisor;
	denominator /= divisor;

	if (sign < 0) {
		numerator = -numerator;
	}

	return [numerator, denominator];
}

//
function renderFractionCore(aNumerator, aDenominator) {
	let retStrFrac = "";
	if (aDenominator === 1) {
		retStrFrac = aNumerator;
	} else {
		if (aNumerator < 0) {
			retStrFrac = "-\\frac{{" + (- aNumerator) + "}}{{" + aDenominator + "}}";
		} else {
			retStrFrac = "\\frac{{" + aNumerator + "}}{{" + aDenominator + "}}";
		}
	}
	return retStrFrac;
}

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
function renderFractionCore(numerator, denominator) {
	let retStrFrac = "";
	if (denominator === 1) {
		if (numerator === 1) {
			retStrFrac = "";
		}
		else if (numerator === -1) {
			retStrFrac = "-";
		}
		else {
			retStrFrac = numerator;
		}
	}
	else {
		if (numerator < 0) {
			retStrFrac = "-\\frac{{" + (- numerator) + "}}{{" + denominator + "}}";
		} else {
			retStrFrac = "\\frac{{" + numerator + "}}{{" + denominator + "}}";
		}
	}
	return retStrFrac;
}

//
function renderCoefFraction(aCoefA) {
	let retStrFrac = "";
	const [numerator, denominator] = convertToFraction(aCoefA);
	retStrFrac = renderFractionCore(numerator, denominator);
	return retStrFrac;
}

//
function renderNormalFraction(aNum) {
	let retStrFrac = "";
	const [numerator, denominator] = convertToFraction(aNum);
	if (denominator === 1)
	{
		retStrFrac = aNum;
	}
	else {
		if (numerator < 0) {
			retStrFrac = "-\\frac{{" + (- numerator) + "}}{{" + denominator + "}}";
		} else {
			retStrFrac = "\\frac{{" + numerator + "}}{{" + denominator + "}}";
		}
	}
	return retStrFrac;
}

//
function renderIntersection(aIntersection) {
	let retStrIntersection = "";
	if (aIntersection === 0)
	{
		retStrIntersection = "";
	}
	else if (aIntersection === 1)
	{
		retStrIntersection = "+ 1";
	}
	else if (aIntersection === -1)
	{
		retStrIntersection = "- 1";
	}
	else
	{
		const [numerator, denominator] = convertToFraction(aIntersection);
		retStrIntersection = (aIntersection < 0 ? "" : "+") + renderFractionCore(numerator, denominator);
	}
	return retStrIntersection;
}

//
function makeFomulraQuadratic(aCoefA) {
	let retStrFormula = "Curve : y = a x^{2} =";
	retStrFormula += renderCoefFraction(aCoefA) + "x^{2}";
	return retStrFormula;
}

//
function makeFomulraLinear0(aCoefA, aXp, aXq, aFlagDispAns) {
	let retStrFormula = "";

	const slope = aCoefA * (aXp + aXq);
	const intersection = - aCoefA * aXp * aXq;

	if (aFlagDispAns) {
		retStrFormula = "Line : y = b x + c = " + renderCoefFraction(slope) + " x " + renderIntersection(intersection);
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
	const strBase = renderNormalFraction(base);
	const strTriangle = renderNormalFraction(triangle);
	if (aFlagDispAns) {
		retStrFormula = "= \\frac{1}{2} \\times "+ strBase + "\\times (" + aXq + " - (" + aXp + ")) = " + strTriangle;
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
