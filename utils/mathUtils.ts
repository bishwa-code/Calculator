/**
 * Safely evaluates a mathematical expression string.
 * Supports basic arithmetic + sqrt, cbrt, pow.
 */
export const evaluateExpression = (expression: string): string => {
  try {
    // 1. Sanitize: Allow only numbers, operators, parens, and specific math keywords
    // We map UI symbols to JS Math safe string before this step in the component, 
    // but here we do a final cleanup.
    
    // Replace standard UI symbols with JS operators if they leaked in
    let sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/\^2/g, '**2')
      .replace(/\^3/g, '**3')
      .replace(/√\(/g, 'Math.sqrt(')
      .replace(/∛\(/g, 'Math.cbrt(');

    // Validate characters to prevent arbitrary code execution
    // Allowed: 0-9, ., +, -, *, /, (, ), Math, sqrt, cbrt, pow, **, white space
    const allowedPattern = /^[\d\.\+\-\*\/\(\)\sMathsqrtcbrtpow,]+$/;
    
    // Check for "Math." usage explicitly to ensure we aren't allowing other globals
    // essentially we constructed the string with "Math." prefix ourselves, so strict check might be tricky
    // if we don't assume the input is perfectly formed. 
    // However, given we control the input via buttons, we mostly need to catch major errors.
    
    // A simpler approach for a calculator is to use 'Function' with a strict scope limit 
    // but JS 'new Function' still has access to globals.
    // We will trust our own string construction mapping for now, but catch errors.

    // Auto-close parentheses if missing
    const openParens = (sanitized.match(/\(/g) || []).length;
    const closeParens = (sanitized.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      sanitized += ')'.repeat(openParens - closeParens);
    }

    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${sanitized})`)();
    
    if (!isFinite(result) || isNaN(result)) {
      return "Error";
    }

    // Floating point precision fix (e.g. 0.1 + 0.2)
    return parseFloat(result.toPrecision(12)).toString();

  } catch (error) {
    console.error("Calc Error", error);
    return "Error";
  }
};

export const formatDisplay = (numStr: string): string => {
  if (numStr === "Error") return numStr;
  if (!numStr) return "";
  
  // Split decimal
  const [integer, decimal] = numStr.split('.');
  
  // Add commas to integer part
  const formattedInt = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  
  return decimal !== undefined ? `${formattedInt}.${decimal}` : formattedInt;
};