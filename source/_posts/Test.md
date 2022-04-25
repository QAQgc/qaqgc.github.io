---
title: 观察者模式
# description: 啊这 #摘要
# icon: icon-women-line

date: 2021-05-26 16:50:04
readmore: true


categories:
- 学习
tags:
- Markdown
- 学习
---

# 《设计模式》实验指导书

- 姓名：金灿霖
- 学号：190207331

## 观察者模式实验（4学时）

- [ ] ==我承诺：本次实验完全为本人独立完成！==

### 实验目的

- 理解观察者模式的基本概念
- 了解观察者模式和监听器的关系
- 掌握观察者模式的基本用法

### 实验工具

- 计算机，安装JDK
- vscode或eclipse

### 实验题目

- 结合天气预报公告板的 `Observer` 例子，利用 `JavaBean` 事件机制，写一个简易的天气预报公告板

### 实验步骤

1. 阅读 `Observer` 程序代码

2. 修改其继承与实现关系，不让 `WeatherData` 类实现 `Subject` 接口，不让`CurrentConditionsDisplay` 等几个 `Display` 类实现 `Observer` 接口

3. 修改 `WeatherData` 注册、注销、通知观察者的方法： `registerObserver(Observer o)` , `removeObserver(Observer o)` ,  `notifyObservers()` ，分别将其改为对应 `Bean` 事件中规范的： `addActionListener(ActionListener o)` , `removeActionListener(ActionListener o) ` , `processEvent(ActionEvent o)` 

4. 修改 `WeatherData` 类的 `processEvent()` 方法中对应的程序代码，使用 `actionPerformed()` 方法代替 `update()` 方法

5. 修改 `WeatherData` 类的 `measurementsChanged()` 方法，将其改为下述代码并思考原因：

   ````java
   public void measurementsChanged() {
       processEvent(new ActionEvent(this, ActionEvent.ACTION_PERFORMED, null));
   }
   ````

6. 修改 `CurrentConditionsDisplay` 和其他 `Display` 的构造函数中 `weatherData.registerObserver(this)` ，改为

   ```java
   weatherData.addActionListener(new ActionListener() {
       @Override
       public void actionPerformed(ActionEvent arg0) {
           //TODO Auto-generated method stub
       }
   });
   ```

7. 使用 `ActionListener` 中 `actionPerformed()` 方法实现监听事件的执行，并使用 `WeatherData wd = (WeatherData)(arg0.getSource());` 获得传入的对象，进行进一步的操作，如数据显示等

### 实验内容

- 关键类的源程序清单：
  ```java
  //WeatherData
   import java.awt.event.ActionEvent;
   import java.awt.event.ActionListener;
   import java.util.ArrayList;
   import java.util.List;

   public class WeatherData {
      private List<ActionListener> observers;
      private float temperature;
      private float humidity;
      private float pressure;
      
      public WeatherData() {
         observers = new ArrayList<ActionListener>();
      }
      
      public void addActionListener(ActionListener o) {
         observers.add(o);
      }
      
      public void removeActionListener(ActionListener o) {
         observers.remove(o);
      }
      
      public void processEvent(ActionEvent o) {
         for (ActionListener observer : observers) {
            observer.actionPerformed(o);
         }
      }
      
      public void measurementsChanged() {
         processEvent(new ActionEvent(this, ActionEvent.ACTION_PERFORMED, null));
      }
      
      public void setMeasurements(float temperature, float humidity, float pressure) {
         this.temperature = temperature;
         this.humidity = humidity;
         this.pressure = pressure;
         measurementsChanged();
      }

      public float getTemperature() {
         return temperature;
      }
      
      public float getHumidity() {
         return humidity;
      }
      
      public float getPressure() {
         return pressure;
      }
   }
  ```

  ```java
  //CurrentConditionsDisplay
   import java.awt.event.ActionEvent;
   import java.awt.event.ActionListener;

   public class CurrentConditionsDisplay implements DisplayElement {
      private float temperature;
      private float humidity;
      private WeatherData weatherData;

      public CurrentConditionsDisplay(WeatherData weatherData) {
         this.weatherData = weatherData;
         weatherData.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
               WeatherData wd = (WeatherData) (e.getSource());
               update(wd.getTemperature(), wd.getHumidity(), wd.getPressure());
            }
         });
      }

      public void update(float temperature, float humidity, float pressure) {
         this.temperature = temperature;
         this.humidity = humidity;
         display();
      }

      public void display() {
         System.out.println("Current conditions: " + temperature + "F degrees and " + humidity + "% humidity");
      }
   }
  ```

  ```java
  //ForecastDisplay
   import java.awt.event.ActionEvent;
   import java.awt.event.ActionListener;

   public class ForecastDisplay implements DisplayElement {
      private float currentPressure = 29.92f;  
      private float lastPressure;
      private WeatherData weatherData;

      public ForecastDisplay(WeatherData weatherData) {
         this.weatherData = weatherData;
         weatherData.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
               WeatherData wd = (WeatherData) (e.getSource());
               update(wd.getTemperature(), wd.getHumidity(), wd.getPressure());
               
            }
         });
      }

      public void update(float temp, float humidity, float pressure) {
         lastPressure = currentPressure;
         currentPressure = pressure;

         display();
      }

      public void display() {
         System.out.print("Forecast: ");
         if (currentPressure > lastPressure) {
            System.out.println("Improving weather on the way!");
         } else if (currentPressure == lastPressure) {
            System.out.println("More of the same");
         } else if (currentPressure < lastPressure) {
            System.out.println("Watch out for cooler, rainy weather");
         }
      }
   }
  ```

  ```java
  //HeatIndexDisplay
   import java.awt.event.ActionEvent;
   import java.awt.event.ActionListener;

   public class HeatIndexDisplay implements DisplayElement {
      float heatIndex = 0.0f;
      private WeatherData weatherData;

      public HeatIndexDisplay(WeatherData weatherData) {
         this.weatherData = weatherData;
         weatherData.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
               WeatherData wd = (WeatherData) (e.getSource());
               update(wd.getTemperature(), wd.getHumidity(), wd.getPressure());
               
            }
         });
      }

      public void update(float t, float rh, float pressure) {
         heatIndex = computeHeatIndex(t, rh);
         display();
      }
      
      private float computeHeatIndex(float t, float rh) {
         float index = (float)((16.923 + (0.185212 * t) + (5.37941 * rh) - (0.100254 * t * rh) 
            + (0.00941695 * (t * t)) + (0.00728898 * (rh * rh)) 
            + (0.000345372 * (t * t * rh)) - (0.000814971 * (t * rh * rh)) +
            (0.0000102102 * (t * t * rh * rh)) - (0.000038646 * (t * t * t)) + (0.0000291583 * 
            (rh * rh * rh)) + (0.00000142721 * (t * t * t * rh)) + 
            (0.000000197483 * (t * rh * rh * rh)) - (0.0000000218429 * (t * t * t * rh * rh)) +
            0.000000000843296 * (t * t * rh * rh * rh)) -
            (0.0000000000481975 * (t * t * t * rh * rh * rh)));
         return index;
      }

      public void display() {
         System.out.println("Heat index is " + heatIndex);
      }
   }
  ```

  ```java
  //StatisticsDisplay
   import java.awt.event.ActionEvent;
   import java.awt.event.ActionListener;

   public class StatisticsDisplay implements DisplayElement {
      private float maxTemp = 0.0f;
      private float minTemp = 200;
      private float tempSum= 0.0f;
      private int numReadings;
      private WeatherData weatherData;

      public StatisticsDisplay(WeatherData weatherData) {
         this.weatherData = weatherData;
         weatherData.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
               WeatherData wd = (WeatherData) (e.getSource());
               update(wd.getTemperature(), wd.getHumidity(), wd.getPressure());
            }
         });
      }

      public void update(float temp, float humidity, float pressure) {
         tempSum += temp;
         numReadings++;

         if (temp > maxTemp) {
            maxTemp = temp;
         }
   
         if (temp < minTemp) {
            minTemp = temp;
         }

         display();
      }

      public void display() {
         System.out.println("Avg/Max/Min temperature = " + (tempSum / numReadings)
            + "/" + maxTemp + "/" + minTemp);
      }
   }
  ```



- 相关类的类图：

### 实验总结

- 此处可列出心得体会、遇到的问题、尝试的解决方案、其他意见或建议等。


### 教师评语

