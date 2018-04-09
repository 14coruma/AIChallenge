import rpyc

msg = "Start"
newMsg = False

class MyService(rpyc.Service):
    exposed_msg = ""

    def on_connect(conn):
        # code that runs when a connection is created
        # (to init the service, if needed)
        pass

    def on_disconnect(conn):
        # code that runs after the connection has already closed
        # (to finalize the service, if needed)
        pass

    def exposed_getMessage(self):
        global msg
        global newMsg
        while newMsg == False:
            pass
        newMsg = False
        return msg

    def exposed_setMessage(self, message):
        global msg
        global newMsg
        msg = message
        newMsg = True
        # print "Got message: " + msg

if __name__ == "__main__":
    from rpyc.utils.server import ThreadedServer
    t = ThreadedServer(MyService, port=18861)
    t.start()
