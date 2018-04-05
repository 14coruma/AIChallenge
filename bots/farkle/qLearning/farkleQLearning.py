import rpyc

c = rpyc.connect("localhost", 18861)
while True:
    print c.root.getMessage()
    c.root.setMessage( "Got it!" )
