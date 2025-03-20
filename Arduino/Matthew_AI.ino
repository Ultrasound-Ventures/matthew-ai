#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <AsyncTCP.h>
#include <ArduinoJson.h>
#include <SPIFFS.h>

// WiFi Credentials
const char* ssid = "HeySalad_02";
const char* password = "GutenTag%800";

// LED strip configuration
#define LED_PIN    D0  // Change to actual pin if different
#define LED_COUNT  30  // Number of LEDs in your 1m strip (30 LEDs per meter)

// Create AsyncWebServer
AsyncWebServer server(80);

// Declare our NeoPixel strip object
Adafruit_NeoPixel strip(LED_COUNT, LED_PIN, NEO_GRB + NEO_KHZ800);

// Variables to store current LED settings
int brightness = 50;
int animationMode = 0; // 0=off, 1=colorWipe, 2=rainbow, 3=theaterChase, etc.
int animationSpeed = 50;
uint32_t currentColor = 0xFF0000; // Red by default

// Flag to indicate if an animation is running
bool isAnimationRunning = false;
unsigned long lastAnimationUpdate = 0;
int animationStep = 0;

// Function prototypes
void updateLEDs(DynamicJsonDocument &doc);
void handleAnimation();

// Convert hex color string to uint32_t
uint32_t hexToColor(String hexColor) {
  // Remove # if present
  if (hexColor.startsWith("#")) {
    hexColor = hexColor.substring(1);
  }
  
  // Convert hex string to unsigned long
  char* endPtr;
  uint32_t color = strtoul(hexColor.c_str(), &endPtr, 16);
  
  return color;
}

// Convert uint32_t color to hex string
String colorToHex(uint32_t color) {
  char hexColor[8];
  sprintf(hexColor, "#%06X", color);
  return String(hexColor);
}

void setup() {
  Serial.begin(115200);
  Serial.println("\n\n=== ESP32 LED HTTP Controller ===");
  
  // Initialize LED strip
  strip.begin();
  strip.show();
  strip.setBrightness(brightness);
  
  // Test if strip is working with a quick flash
  Serial.println("Testing LED strip...");
  for(int i=0; i<LED_COUNT; i++) {
    strip.setPixelColor(i, strip.Color(50, 0, 0));
  }
  strip.show();
  delay(500);
  strip.clear();
  strip.show();
  Serial.println("LED test complete");
  
  // Connect to WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  int wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 20) {
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }
  Serial.println();
  
  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("WiFi connected successfully!");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
  } else {
    Serial.println("Failed to connect to WiFi. Please check credentials.");
    // Continue anyway - might connect later
  }
  
  // Handle CORS
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
  
  // GET endpoint for status
  server.on("/status", HTTP_GET, [](AsyncWebServerRequest *request) {
    DynamicJsonDocument doc(512);
    doc["brightness"] = brightness;
    doc["color"] = colorToHex(currentColor);
    doc["animation"] = animationMode;
    doc["speed"] = animationSpeed;
    
    String response;
    serializeJson(doc, response);
    
    request->send(200, "application/json", response);
  });
  
  // POST endpoint for updating settings
  server.on("/update", HTTP_POST, [](AsyncWebServerRequest *request) {
    // Placeholder response
    request->send(200, "application/json", "{\"status\":\"received\"}");
  }, NULL, [](AsyncWebServerRequest *request, uint8_t *data, size_t len, size_t index, size_t total) {
    DynamicJsonDocument doc(1024);
    DeserializationError error = deserializeJson(doc, data, len);
    
    if (error) {
      Serial.print("deserializeJson() failed: ");
      Serial.println(error.c_str());
      request->send(400, "application/json", "{\"status\":\"error\",\"message\":\"Invalid JSON\"}");
      return;
    }
    
    // Update LED settings
    updateLEDs(doc);
    
    // Final response will be sent by the main handler
  });
  
  // Simple test endpoint
  server.on("/", HTTP_GET, [](AsyncWebServerRequest *request) {
    request->send(200, "text/plain", "ESP32 LED HTTP Controller is running");
  });
  
  // Handle preflight requests
  server.onNotFound([](AsyncWebServerRequest *request) {
    if (request->method() == HTTP_OPTIONS) {
      request->send(200);
    } else {
      request->send(404, "text/plain", "Not found");
    }
  });
  
  // Start server
  server.begin();
  Serial.println("HTTP server started");
  
  // Flash LED strip to indicate ready
  for(int i=0; i<3; i++) {
    for(int j=0; j<LED_COUNT; j++) {
      strip.setPixelColor(j, strip.Color(0, 50, 0));
    }
    strip.show();
    delay(200);
    strip.clear();
    strip.show();
    delay(200);
  }
}

void loop() {
  // Handle animations if enabled
  if (isAnimationRunning) {
    handleAnimation();
  }
  
  // Check WiFi connection and attempt reconnect if necessary
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi connection lost. Attempting to reconnect...");
    WiFi.reconnect();
  }
}

void updateLEDs(DynamicJsonDocument &doc) {
  // Parse commands
  if (doc.containsKey("brightness")) {
    brightness = doc["brightness"];
    Serial.println("Setting brightness: " + String(brightness));
    strip.setBrightness(brightness);
  }
  
  if (doc.containsKey("color")) {
    // Convert color string to uint32_t
    String colorStr = doc["color"];
    Serial.println("Setting color: " + colorStr);
    currentColor = hexToColor(colorStr);
    
    // If animation is not running, set all LEDs to this color
    if (!isAnimationRunning) {
      for(int i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, currentColor);
      }
      strip.show();
    }
  }
  
  if (doc.containsKey("animation")) {
    animationMode = doc["animation"];
    Serial.println("Setting animation mode: " + String(animationMode));
    
    if (animationMode == 0) {
      // Turn off animation
      Serial.println("Animation off");
      isAnimationRunning = false;
      
      // Set all LEDs to current color
      for(int i=0; i<strip.numPixels(); i++) {
        strip.setPixelColor(i, currentColor);
      }
      strip.show();
    } else {
      // Start animation
      Serial.println("Starting animation");
      isAnimationRunning = true;
      animationStep = 0;
      lastAnimationUpdate = 0; // Force immediate update
    }
  }
  
  if (doc.containsKey("speed")) {
    animationSpeed = doc["speed"];
    Serial.println("Setting animation speed: " + String(animationSpeed));
  }
}

// Handle animations based on current mode
void handleAnimation() {
  unsigned long currentMillis = millis();
  
  // Only update animation at specified intervals
  if (currentMillis - lastAnimationUpdate < (201 - animationSpeed)) {
    return;
  }
  
  lastAnimationUpdate = currentMillis;
  
  switch (animationMode) {
    case 1: // Color wipe
      if (animationStep < strip.numPixels()) {
        strip.setPixelColor(animationStep, currentColor);
        strip.show();
        animationStep++;
      } else {
        animationStep = 0;
        strip.clear();
      }
      break;
      
    case 2: // Rainbow
      for(int i=0; i<strip.numPixels(); i++) {
        int hue = (animationStep + (i * 65536L / strip.numPixels())) % 65536;
        strip.setPixelColor(i, strip.gamma32(strip.ColorHSV(hue)));
      }
      strip.show();
      animationStep = (animationStep + 256) % 65536;
      break;
      
    case 3: // Theater chase
      if (animationStep % 3 == 0) {
        strip.clear();
      }
      for(int i=animationStep % 3; i<strip.numPixels(); i += 3) {
        strip.setPixelColor(i, currentColor);
      }
      strip.show();
      animationStep = (animationStep + 1) % 30; // Full cycle after 30 steps
      break;
  }
}