import rpyc
import sys
import json

c = rpyc.connect( "localhost", 18861 )
data = json.loads( sys.argv[1] )
c.root.setMessage( data["state"] )
print c.root.getMessage()
