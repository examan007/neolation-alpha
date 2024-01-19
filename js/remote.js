var RemoteManager = function() {
    var consolex = {
        log: function(msg) {}
    }
    const AppMan = ApplicationManager((event, flag) => {
              const services = getServicesArray('.neo-service')
              function getJSONMsg() {
                try{
                    return JSON.parse(event.data)
                } catch (e) {
                }
                return {}
              }
              const jsonobj = getJSONMsg()
              if (typeof(jsonobj.operation) === "undefined") {
                if (typeof(flag) === "undefined") {
                    if (!LoginFlag) {
                        $('#login').css("display", "none")
                    }
                    console.log("event.data=[" + event.data + "]")
                } else
                if (flag == true) {
                    $('#login').css("display", "block")
                    console.log("event.data=[" + event.data + "]")
                }
              } else
                if (jsonobj.operation === 'closesidebar') {
                    toggleSidebar(false)
                    createFilterSelect(false)
                } else
                if (jsonobj.operation === 'showappointmentrequest') {
                    console.log("appointment request")
                    console.log("Request object", JSON.stringify($('#login').children()))
                    function getSectionName(callback) {
                        AppMan.testCookie((token)=> {
                            if (typeof(token) === 'undefined') {
                                callback('Appoint')
                            } else
                            if (token == null) {
                                callback('Appoint')
                            } else
                            if (token.length > 16) {
                                callback('Request')
                            } else {
                                callback('Appoint')
                            }
                        })
                    }
                    getSectionName((sectionname) => {
                        var message = {
                          operation: 'showsection',
                          sectionname: sectionname,
                          datetime: jsonobj.datetime,
                          message: jsonobj,
                          services: jsonobj.usermessage + " " + getServicesObj().services,
                          classname: jsonobj.title
                        }
                        sendToChildWindow('login', message)
                        $('#login').css("display", "block")
                    })
                } else
                if (jsonobj.operation === 'changeappointmentrequest') {
                    if (jsonobj.event.title.indexOf("Booked") < 0) {
                        console.log("appointment change")
                        console.log("Request object", JSON.stringify($('#login').children()))
                        var message = {
                          operation: 'showsection',
                          sectionname: 'Change',
                          datetime: jsonobj.event.start,
                          usermessage: jsonobj.event.title,
                          message: jsonobj
                        }
                        sendToChildWindow('login', message)
                        $('#login').css("display", "block")
                    }
                } else
                if (jsonobj.operation === 'bookpageloaded') {
                    console.log("neoOnload Book page loaded.")
                    BookingReady = true
                    while (StartupBookingQueue.length > 0) {
                        sendToChildWindow('calendar', StartupBookingQueue.shift())
                    }
                } else
                if (jsonobj.operation === 'loginpageloaded') {
                    console.log("Login page loaded.")
                    welcomeFunction(AppMan)
                    $('#login').css('display','none')
                    LoginReady = true
                    while (StartupLoginQueue.length > 0) {
                        sendToChildWindow('login', StartupLoginQueue.shift())
                    }
                } else
              if (jsonobj.operation === "exitlogin") {
                    $('#login').css("display", "none")
              } else
              if (jsonobj.operation === "showlogin") {
                    if (AppMan.getQueryValue('nomenuflag') !== "true") {
                       $('#login').css("display", "block")
                    }
              } else
              if (jsonobj.operation === "autoscrollswitch") {
                    $('#rightpanel').attr('data', "side.html#" + services[ServiceIndex] + "?nomenuflag=true")
                    if (ServiceIndex >= (services.length-1)) {
                        ServiceIndex = 1
                    } else {
                        ServiceIndex++
                    }
              } else
              if (jsonobj.operation === "showtoken") {
                  console.log("xshowtoken=[" + JSON.stringify(jsonobj.token) + "]")
                  console.log("token value=[" + $('#Token').text() + "]")
                  $('#Token').text(JSON.stringify(jsonobj.token))
              } else
              if (jsonobj.operation === "createevent") {
                sendToChildWindow('calendar', jsonobj)
                changeSection("Booking")
              } else
              if (jsonobj.operation === "readappointments") {
                sendToChildWindow('calendar', jsonobj)
                console.log("readappointments: " + JSON.stringify(jsonobj))
                try {
                    const token = jsonobj.data.token
                    console.log("readappointments: ", JSON.stringify(token))
                    setCurrentToken(token)
                } catch (e) {
                    console.log("readappointments: " + toString())
                }
              } else
              if (jsonobj.operation === "readservices") {
                processServicesData(jsonobj.data)
              } else
              if (jsonobj.operation === "salonhours") {
                sendToChildWindow('login', jsonobj)
              }
            })
/*            AppMan.
            verify(
            () => {
                thishref = $('#login').attr('data')
                console.log("Xthishref=[" + thishref + "]")
                return thishref
            },
            (newquery) => {
                $('#login').attr('data', newquery)
            })
            */

        function  sendToChildWindow(identifier, messageobj) {
            console.log("sendToChildWindow: " + JSON.stringify(messageobj))
            var objectEl = document.getElementById(identifier);
            if (objectEl.contentWindow != null) {
              function sendMessage(message) {
                  objectEl.contentWindow.postMessage(message, "*");
                  console.log("To " + identifier + " window message posted [" + message + "]")
              }
              sendMessage(JSON.stringify(messageobj))
             } else {
                console.log("Cannot get window object. [" + identifier + "]")
                window.setTimeout(()=> {
                    sendToChildWindow(identifier, messageobj)
                }, 1000)
             }
        }
    return {
        showLogin: function (sectionname) {
            var message = {
              operation: 'showsection',
              sectionname: sectionname,
              datetime: jsonobj.datetime,
              message: jsonobj,
              services: jsonobj.usermessage + " " + getServicesObj().services,
              classname: jsonobj.title
            }
            sendToChildWindow('login', message)
            $('#login').css("display", "block")
        },
        getLoginWindow: function (operation) {
            const messageobj = {
                operation: operation,
            }
            $('#login').css("display", "block")
            $('#login').on('click', function() {
                  console.log('login was clicked!')
                  //toggleSidebar(false)
            })
            sendToChildWindow('login', messageobj)
        }
    }
}
