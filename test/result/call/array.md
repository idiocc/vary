## sets value
["Accept", "Accept-Language"]

/* expected */
Accept, Accept-Language
/**/

## ignores double-entries
["Accept", "Accept"]

/* expected */
Accept
/**/

## is case-insensitive
["Accept", "ACCEPT"]

/* expected */
Accept
/**/

## handles contained ＊
["Origin", "User-Agent", "*", "Accept"]

/* expected */
*
/**/