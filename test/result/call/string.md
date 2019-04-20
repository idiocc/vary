## sets value
"Accept"

/* expected */
Accept
/**/

## sets value when vary header
"Accept, Accept-Encoding"

/* expected */
Accept, Accept-Encoding
/**/

## accepts LWS
"  Accept     ,     Origin    "

/* expected */
Accept, Origin
/**/

## handles contained ＊
"Accept,*"

/* expected */
*
/**/

## sets ＊
"*"

/* expected */
*
/**/