//-----------------------------------------------------------------------------

//The below mentioned are the pin connectors of rfid and esp32  

//RST - 5
//MISO - 19
//mosi - 23
//skc - 18
//sda - 21

// other pins are mentioned below 

//-------------------------------------------------------------------------------

#include <WiFi.h>
#include <HTTPClient.h>

#include <SPI.h>
#include <MFRC522.h>

#define RST_PIN   5
#define SS_PIN    21
#define lock    27   //relay
#define led1    12   //yellow
#define led2    13   //green
#define ledin1    25 // yellow
#define ledin2    33 //green
#define led3    14   // red
#define switch  26   //manetic

MFRC522 mfrc522(SS_PIN, RST_PIN);

unsigned long previousMillis = 0;
unsigned long interval = 30000;

const char* ssid = "Chacko Mash";
const char* password = "marannupoi";
const char* webhook_url = "https://discord.com/api/webhooks/1128190625200738424/RhR6nM5pXIYgZcN3IVYuAqKwV9N7DUDlCqrad3S-SSmgG7RVqB-iyS-A3AyHo517eNtR";

String door = "Not Available";
String uid = "";
String owner = "";
String json = "";
bool autoLock = false;


void connect_WiFi() {
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi ..");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print('.');
    delay(1000);
  }
  Serial.println(WiFi.localIP());
  digitalWrite(led1,1);
  digitalWrite(ledin1,1);

}



void connect_MFRC() {
  SPI.begin();
  mfrc522.PCD_Init();
  Serial.println("\nReady to read RFID tags...");
}



void sendDiscordWebhook() {
  HTTPClient http;
  http.begin(webhook_url);
  http.addHeader("Content-Type", "application/json");


  if(autoLock == true ) {
    
    json = "{\"content\":null,\"embeds\":[{\"title\":\":butterfly:   Info! Inovus Smart Door   :butterfly:\",\"description\":\"Hey, did you know!\\nOur **Inovus Smart Door** just triggered an auto-lock.!\\n\\n> Door Status : **Locked**\\n> Agent : **Magnetic Switch**\\n.\",\"color\":5614830,\"footer\":{\"text\":\"Note : Please ignore this activity if the act is legit.\"}}],\"attachments\":[]}";
    
  } else {  

    if(owner != "") {
  
      json = "{\"content\":null,\"embeds\":[{\"title\":\":white_check_mark:   Log! Inovus Smart Door   :white_check_mark:\",\"description\":\"Hey, did you know!\\nSomeone just opened our **RFID Secured Door** !\\n\\n> Door Status : **";
      json += door;
      json += "**\\n> Tag ID : **";
      json += uid;
      json += "**\\n> Tag Owner : **";
      json += owner;
      json += "**\\n.\",\"color\":7844437,\"footer\":{\"text\":\"Note : Please ignore this activity if the act is legit.\"}}],\"attachments\":[]}";
    
    } else {
      json = "{\"content\":null,\"embeds\":[{\"title\":\":warning:   Alert! Inovus Smart Door   :warning:\",\"description\":\"Hey, did you know!\\nSomeone just opened our **RFID Secured Door** !\\n\\n> Door Status : **";
      json += door;
      json += "**\\n> Tag ID : **";
      json += uid;
      json += "**\\n> Tag Owner : **";
      json += "Not Registered";
      json += "**\\n.\",\"color\":10381369,\"footer\":{\"text\":\"Note : Please ignore this activity if the act is legit.\"}}],\"attachments\":[]}";
      
    }
  }
  Serial.println(json);
  
  int http_code = http.POST(json);
  if (http_code == 204) {
    Serial.println("Discord Webhook Sent...");
  } else {
    Serial.println("Error sending webhook...");
  }
}



void setup() {
  Serial.begin(115200);

  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);
  pinMode(lock, OUTPUT);
  pinMode(switch, INPUT);
  digitalWrite(lock, 0); 

  
  connect_WiFi();
  Serial.print("RSSI: ");
  Serial.println(WiFi.RSSI());
  
  connect_MFRC();
}



void loop() {
  
  unsigned long currentMillis = millis();
  if ((WiFi.status() != WL_CONNECTED) && (currentMillis - previousMillis >=interval)) {
    Serial.println("Reconnecting to WiFi...");
    WiFi.disconnect();
    WiFi.reconnect();
    previousMillis = currentMillis;
  }
  
  
  if (mfrc522.PICC_IsNewCardPresent() && mfrc522.PICC_ReadCardSerial()) {
    
    for (byte i = 0; i < mfrc522.uid.size; i++) {
      uid.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? "0" : ""));
      uid.concat(String(mfrc522.uid.uidByte[i], HEX));
    }
    
    Serial.print("RFID tag detected: ");
    Serial.println(uid);


    if(uid == "22987321") {
      owner = "Arjun Krishna";
      digitalWrite(led2,1);
      digitalWrite(ledin2,1);
      digitalWrite(lock,1);
      delay(5000);
      digitalWrite(led2,0);
      digitalWrite(ledin2,0);
      digitalWrite(lock,0);
    } else if(uid == "e327e72e") {
      owner = "Badhusha Shaji";
      digitalWrite(led2,1);
      digitalWrite(ledin2,1);
      digitalWrite(lock,1);
      delay(5000);
      digitalWrite(led2,0);
      digitalWrite(ledin2,0);
      digitalWrite(lock,0);
    } else if(uid == "40103283") {
      owner = "Nikhil T Das ";
      digitalWrite(led2,1);
      digitalWrite(ledin2,1);
      digitalWrite(lock,1);
      delay(5000);
      digitalWrite(led2,0);
      digitalWrite(ledin2,1);
      digitalWrite(lock,0);
    } else if(uid == "c1fa8419") {
      owner = " Abhishek v Gopal";
      digitalWrite(led2,1);
      digitalWrite(lock,1);
      digitalWrite(ledin2,1);
      delay(5000);
      digitalWrite(led2,0);
      digitalWrite(ledin2,0);
      digitalWrite(lock,0);
    } else if(uid == "60604821") {
      owner = " Roji Thomas";
      digitalWrite(led2,1);
      digitalWrite(lock,1);
      digitalWrite(ledin2,1);
      delay(5000);
      digitalWrite(led2,0);
      digitalWrite(ledin2,0);
      digitalWrite(lock,0);
    } else {
      owner = "";
    }

    if(owner == "") {
      Serial.println("Owner not found...");
      digitalWrite(led3,1);
      delay(1000);
      digitalWrite(led3,0);
    } else {
      Serial.print("Owner Name: ");
      Serial.println(owner);
    }

    sendDiscordWebhook();

    uid = "";
    owner = "";
        
    mfrc522.PICC_HaltA();
    mfrc522.PCD_StopCrypto1();
  }




  bool sensor = digitalRead(switch);

  if (sensor) {
    autoLock = true;
    Serial.println("Magnetic Switch (if) : " + sensor);
    sendDiscordWebhook();
  } 

}
