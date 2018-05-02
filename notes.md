Creating data link to external file to bash
- mkdir data
- cd data
- wget "paste link"

Notes on Crossfilter Custom Reduce Function
1. Order of functions -- 1st add, 2nd Remove, 3rd init
2. p is object returned from init
3. v = copy of the current record
4. Use .valueAccessor to get a value from the custom reduce functions
5. must have "return p;" at the end of the add and remove functions
6. 

