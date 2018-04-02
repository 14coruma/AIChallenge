import sys
import json

def move( data ):
    "Returns a move string based on state data json"
    moveObj = json.loads( '{"bank":[], "done":1}')
    return json.dumps( moveObj );

# {"bank":[1, 2], "dice":[1, 2, 3, 4], "temp":100}
data = json.loads( sys.argv[1] )

# {"bank":[2,1],"done":0}
print move( data )
