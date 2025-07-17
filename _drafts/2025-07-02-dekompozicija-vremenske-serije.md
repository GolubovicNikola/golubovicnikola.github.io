---
layout: post
title: "Dekompozicija vremenske serije: Pogled kroz šumu"
date: 2025-06-28
author: nikola
categories: [Data Science, Time Series]
tags: [forecasting, data visualization]
pin: true
math: true
---

# Dekompozicija vremenske serije

Kao što smo videli vremenska serija može da sadrži različite šablone u sebi, i često je od velike pomoći podela iste na njene komponente – gde svaka komponenta opisuje uticaj pojedinačnog šablona. Modeli za dekompoziciju, dele vremensku seriju na ovaj način. 

Dekompozicija vremenske serije je statistički proces u kome se vremenska serija deli na komponente:
- trend-cikličnost, (često se naziva samo trend zbog jednostavnosti)
- periodičnost
- preostalu komponentu – reziduale (koja sadrži slučajnosti)

Postoje dva načina dekompozicije:
1. Dekompozicija zasnovana na promeni vrednosti
2. Dekompozicija zasnovana na predvidljivosti (kada nemamo podatke)

*kako u ovom radu posmatramo podatke, baziraćemo se samo na prvom tipu dekompozicije*

![Dekompozicija vremenske serije]({{ site.url }}/assets/images/time-series-decomposition.png)

Ukoliko posmatramo zbirnu dekompoziciju, kompotente u zbiru daju vremensku seriju, tj. imamo: 

$$
\begin{equation}
  x_t = S_t + T_t + R_t,
  \label{eq:summary-decomposition}
\end{equation}
$$

gde je $x_t$ vrednost podataka, $S_t$ periodična komponenta, $T_t$ trend komponenta i $R_t$ preostala (rezidual), sve u vremenu $t$. Slično, možemo napisati i dekompoziciju proizvoda, gde se komponente množe:

$$
\begin{equation}
    x_t = S_t \times T_t \times R_t.
  \label{eq:multiplication-decomposition}
\end{equation}
$$

**slika 13**

Alternativno, umesto korišćenja dekompozicije proizvoda, možemo transformisati podatke do stabilne varijanse i zatim izvršiti dekompoziciju zbira. Ovo je moguće uvođenjem transformacije *log* funkcijom jer

$$ x_t = S_t \times T_t \times R_t$$ ;
je isto što i
$$ \log{y_t} = \log{S_t} + \log{T_t} + \log{R_t}$$



## 2.2.1 Tehnike poravnanja

Postoje vremenske serije koje su u potpunosti slučajne i nepredvidive. Primer takve vremenske serije je vrednost akcija na berzi određene kompanije. Njihova vrednost se ne može predvideti. Međutim, kod većine vremenskih serija pored uticaja slučajnosti, njihova vrednost se menja i pod uticajem određenih spoljašnih faktora (vremenski faktor, politički, socijalni...). Kod tih vremenskih serija postoje metode koji eleminišu uticaj slučajnosti i pružaju nam informacije o njihovim vrednostima. Ove metode, pri pravilnoj upotrebi, jasnije prikazuju komponente trendacikličnosti i periodičnosti. 

Postoje dve grupe metoda za "poravnanje":
- Metode srednje vrednosti (*Averaging Methods*)
- Metode eksponencijalnog poravnanja (*Exponential Smoothing Methods*)

Korišćenje srednje vrednosti je najjednostavniji način za poravnanje vremenske serije. Prvi put se javlja 20-ih godina prošlog veka i koristi sve do 50-ih. Ovaj metod danas služi kao osnova mnogih metoda za dekompoziciju, i kao takav, njegovo razumevanje je od velike važnosti.

Prvo ćemo pokazati na primeru „jednostavnu“ srednju vrednost. 

**Primer**

 
Vlasnik kompanije za preradu voća želi da sazna koliko tona voća dobija od tipičnog dobavljača. Uzima slučajno odabanih 12 dobavljača i podataka o nabavci. Data je sledeća tabela: 

| Dobavljač | Količina (tona) |
|:-----------:|:-----------------:|
| 1         | 9              |
| 2         | 8              |
| 3         | 9              |
| 4         | 12              |
| 5         | 9              |
| 6         | 12              |
| 7         | 11              |
| 8         | 7              |
| 9         | 13              |
| 10        | 9              |
| 11        | 11              |
| 12        | 10              |


Srednja vrednost podataka = 10. Vlasnik kompanije je odlučio da srednju vrednost koristi za estimaciju proizvodnje tipičnog dobavljača. Da li je ovo dobra ili loša estimacija? Računamo prosečnu kvadratnu grešku (MSE):
- **Greška** – razlika između prave i predviđene vrednosti
- **Kvadratna greška** – pomenuta greška na kvadrat
- **Ukupna kvadratna greška (SSE)** – zbir kvadratnih grešaka (Sum of the squared errors)
- **Prosečna kvadratna greška (MSE)** – srednja vrednost kvadratnih grešaka (Mean of the squared errors)

| Dobavljač | Količina (tona) | Greška | Kvadratna greška |
|:---------:|:---------------:|:-------------------:|:----------------:|
|    1      |        9        |         -1          |        1         |
|    2      |        8        |         -2          |        4         |
|    3      |        9        |         -1          |        1         |
|    4      |       12        |         2          |        4         |
|    5      |        9        |         -1          |        1         |
|    6      |       12        |         2          |        4         |
|    7      |       11        |         1          |        1         |
|    8      |        7        |         -3          |        9         |
|    9      |       13        |         3          |        9         |
|   10      |        9        |         -1          |        1         |
|   11      |       11        |         1          |        1         |
|   12      |       10        |         0          |        0         |

 
$SSE = 36$ i $$MSE = 36/12 = 3$$ 
 
Koliko je ovaj estimator dobar? Uporedićemo estomator srednje vrednosti (10) sa predviđanjima da će dobavljač dostaviti 7 ili 9 ili 12 tona voća. 
 
Računajući već pomenute pojmove, za definisane podatke, dobijamo: 

|             | Predviđanje 7 | Predviđanje 9 | Predviđanje 10 | Predviđanje 12 |
|:-----------:|:-------------:|:-------------:|:--------------:|:--------------:|
| **SSE**     |     144       |      48       |      36        |      84        |
| **MSE**     |      12       |       4       |       3        |       7        |

Estimator sa najmanjim MSE je najbolji. Može se matematički pokazati da najbolji estimator, tj onaj koji minimizuje metod prosečne kvadratne greške – srednja vrednost.

Sada ćemo iskoristiti pojam srednje vrednosti u vremenskoj seriji kako bi predvideli neto zaradu. Tabela sadrži podatke o neto zaradi kompanije po godinama, počev od 2011. do 2020. 

| Godina | Neto zarada (milioni) | Srednja vrednost | Greška  | Kvadratna greška |
|:------:|:---------------------:|:----------------:|:-------:|:----------------:|
| 2011   | 46.163                | 48.676           | -2.513  | 6.313            |
| 2012   | 46.998                | 48.676           | -1.678  | 2.814            |
| 2013   | 47.816                | 48.676           | -0.860  | 0.739            |
| 2014   | 48.311                | 48.676           | -0.365  | 0.133            |
| 2015   | 48.758                | 48.676           | 0.082   | 0.007            |
| 2016   | 49.164                | 48.676           | 0.488   | 0.239            |
| 2017   | 49.548                | 48.676           | 0.872   | 0.761            |
| 2018   | 48.915                | 48.676           | 0.239   | 0.057            |
| 2019   | 50.315                | 48.676           | 1.639   | 2.688            |
| 2020   | 50.768                | 48.676           | 2.092   | 4.378            |

$$MSE = 1.8129$$

Pitanje koje se postavlja: da li možemo korišćenjem srednje vrednosti da predvidimo zaradu ukoliko uvidimo da se javlja trend među podacima?

$$slika 14$$

Dakle:
1. Prosečna vrednost uzoraka je koristan estimator za predviđanje samo ukoliko ne postoji trend među podacima. Ukoliko se on javlja, koriste se drugi metodi koji vode računa o uticaju trenda na podatke. 2. Svaki uzorak u prošlosti se posmatra kao jednak – imaju iste „težine“. Prostije rečeno, uticaj 2011. i 2020. godine je isti, dok je verovatnije da će uzorci koji su se desili neposredno jedan za drugim imati sličnu vrednost. Na primer, prosek vrednosti 3,4 i 5 je 4. Znamo tako što smo sabrali ova tri broja i podelili sa njihovim brojem. Drugi način za računanje prosečne vrednosti je sabiranje svake vrednosti deljeno sa ukupnim brojem 
vrednosti, tj:

$\frac{3}{3} + \frac{4}{3} + \frac{5}{3} = 4$

Množioc $\frac{1}{3}$ se naziva *težina*.

$$\overline{x} = \frac{1}{n} \sum_{i=0}^n x_i = \left(\frac{1}{n}\right)x_1 + \left(\frac{1}{n}\right)x_2 + \left(\frac{1}{n}\right)x_3 + \ldots + \left(\frac{1}{n}\right)x_n$$

Vrednost $\left(\frac{1}{n}\right)$ predstavlja težine, i njihov zbir je 1.

### 2.2.2 Pomeranje srednje vrednosti

Posmatrajmo podatke iz tabele o prozvodnji voća. Posmatrajmo podskup ***M*** čiju veličinu definišemo na 3. Onda bi prosečna vrednost prva tri uzorka bila: (9 + 8 + 9)/3 = 8.667 

Ovaj tehnika se naziva poravnanjem (oblik srednje vrednosti). Ovaj proces poravnanja se nastavlja dalje i računa sledeća srednja vrednost tri broja, tako što smo odbacili prvi broj, a uzeli naredni u razmatranje.


Tehnika pomeranja srednje vrednosti (Moving Average) se izračunava kao:

$$
\begin{equation}
  MA_t = {(X_t + X_{t-1} + ... + X_{t-N+1}) \over N}
%   \sum_{n=1}^\infty 1/n^2 = \frac{\pi^2}{6}
  \label{eq:moving-average}
\end{equation}
$$
<!-- $$ x = {-b \pm \sqrt{b^2-4ac} \over 2a} $$ -->
 <!-- $a \ne 0$ -->

U jednačini \eqref{eq:moving-average} je:
- $MA_t$ - srednja vrednost u vremenu $t$
- $X_t$ - uzorak u vremenu $t$
- $N$ - broj uzoraka u prozoru

uslov da je $ t < N$

Primer:

| Dobavljač | Tona | MA     | Greška  | Kvadratna greška |
|:---------:|:----:|:------:|:-------:|:----------------:|
|     1     |  9   |        |         |                  |
|     2     |  8   |        |         |                  |
|     3     |  9   | 8.667  | 0.333   | 0.111            |
|     4     | 12   | 9.667  | 2.333   | 5.444            |
|     5     |  9   | 10.000 | -1.000  | 1.000            |
|     6     | 12   | 11.000 | 1.000   | 1.000            |
|     7     | 11   | 10.667 | 0.333   | 0.111            |
|     8     |  7   | 10.000 | -3.000  | 9.000            |
|     9     | 13   | 10.333 | 2.667   | 7.111            |
|    10     |  9   | 9.667  | -0.667  | 0.444            |
|    11     | 11   | 11.000 | 0       | 0                |
|    12     | 10   | 10.000 | 0       | 0                |

Srednja kvadratna greška $MSE$ za $MA_3$ iznosi 2.42 u poređenju sa prvobitnom vrednošću 3. 