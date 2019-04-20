## ＊: acts as if all values already set
"*"

/* vary */
["Origin", "User-Agent"]
/**/

/* expected */
*
/**/

## ＊: eradicates existing values
"Accept, Accept-Encoding"

/* vary */
"*"
/**/

/* expected */
*
/**/

## ＊: updates bad existing header
"Accept, Accept-Encoding, *"

/* vary */
"Origin"
/**/

/* expected */
*
/**/