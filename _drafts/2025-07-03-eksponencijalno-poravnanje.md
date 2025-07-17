---
layout: post
title: "Eksponencijalno Poravnanje: Od Osnovnih do Naprednih Modela"
date: 2025-04-15
author: nikola
categories: [Data Science, Time Series]
tags: [forecasting, data visualization]
pin: true
math: true
---

## Eksponencijalno poravnanje

Eksponencijalno poravnanje predstavlja vrlo značajnu tehniku poravnavanja vremenskih serija. Postoje tri glavne vrste:

1. Jednostavno eksponencijalno poravnanje (Holt, 1957)
2. Duplo eksponencijalno poravnanje (Holt, 1958)
3. Trostruko eksponencijalno poravnanje (Holt-Vinters metoda, Vinters 1965)

### Jednostvno eksponencijalno poravnanje 

Uvodimo vrednost $S_2$ = $x_1$, gde sa $S_1$ označavamo uzorke poravnanja, a sa $x_i$ originalni uzorak u vremenu $i$, $i < n $. Za $S_3 = \alpha x_2 + (1−\alpha)𝑆_3$; i tako dalje. Kako sa ekponencijalnim poravnanjem krećemo sa drugim uzorkom, ne postoji vrednost za $𝑆_1$. 

Osnovna formula za jednostavno eksponencijalno poravnanje:

$$
\begin{equation}
S_t = \alpha X_{t-1} + (1-\alpha)S_{t-1}, \quad 0 < \alpha \leq 1, \ t \geq 3
%   \sum_{n=1}^\infty 1/n^2 = \frac{\pi^2}{6}
  \label{eq:exponential-soothing}
\end{equation}
$$

gde je:
- $S_t$ - vrednost poravnanja u vremenu t
- $α$ - konstanta poravnanja
- $X_{t-1}$ - stvarna vrednost u prethodnom periodu

**Odabir prvog uzorka**: Inicijalizacija prvog uzorka poravnanja 𝑆2 je od velikog značaja za dalju inicijalizaciju vrednosti $S_t$.  

Ukoliko definišemo vrednost $𝑆_2$ kao $𝑥_1$ to je jedan način inicijalizacije. Drugi način je da odabir 
ciljane vrednosti u vremenskoj seriji, tj $𝑥_𝑖$. Još jedan od načina bi bio prosek prvih četiri ili pet 
uzoraka. 

Može se dokazati da što je manja vrednost parametra $\alpha$, to je značaj odabira inicijalne vrednosti poravnanja veći. Preporuka je da se isprobaju par metoda za inicijalizaciju (pomoću softverskog alata) i tako dobije uvid o uspešnosti pre konačnog podešavanja modela. 

### Zašto se zove *Eksponencijalno* ?

Da bismo dali odgovor na ovo pitanje, proširićemo osnovnu jednačinu zamenom $S_{t-1}$

$$
S_t = \alpha x_{t-1} + (1-\alpha)[\alpha x_{t-2} + (1-\alpha)S_{t-2}] \\
= \alpha x_{t-1} + \alpha(1-\alpha)x_{t-2} + (1-\alpha)^2 S_{t-2}
$$

Daljom zamenom $S_{t-2}$, zatim $S_{t-3}$ i tako dalje, sve dok ne dođemo do $S_2$ (koje je $x_1$), dobijamo sledeću formu jednačine:

$$
S_t = \alpha \sum_{i=1}^{t-2} (1-\alpha)^{i-1} x_{t-i} + (1-\alpha)^{t-2} S_2, \quad t \geq 2
$$

Primer proširene jednačine eksponencijalnog poravnanja za $S_5$:

$$
S_5 = \alpha \left[ (1-\alpha)^0 x_{4} + (1-\alpha)^1 x_{3} + (1-\alpha)^2 x_{2} \right] + (1-\alpha)^3 S_2
$$

Ovo predstavlja eksponencijalnu osobinu: težine $\alpha (1-\alpha)^t$ eksponencijalno opadaju kako $t$ raste. Iz ove osobine možemo zaključiti da uticaj prethodnih vrednosti na $S_t$ opada sa svakim narednim vremenom $t$.

Kada je $\alpha$ blizu 1, poravnanje (odbacivanje prethodnih uzoraka) dolazi brzo, dok kada je $\alpha$, poravnanje je sporo. Ovo je prikazano sledećom tabelo

| $\alpha$ | $(1-\alpha)$ | $(1-\alpha)^2$ | $(1-\alpha)^3$ | $(1-\alpha)^4$ |
|:--------:|:------------:|:--------------:|:--------------:|:--------------:|
|   0.9    |     0.1      |     0.01       |     0.001      |    0.0001      |
|   0.5    |     0.5      |     0.25       |     0.125      |    0.0625      |
|   0.1    |     0.9      |     0.81       |     0.729      |    0.6561      |

Najbolju vrednost za $\alpha$ biramo tako vrednost rezultira najmanjom prosečnom greškom kvadrata 
$(MSE)$. 

Primer sa podacima koje sadrže 12 posmatranih uzoraka vremenske serije: 

| VREME t | xₜ | Sₜ (α=0.1) | GREŠKA | KVADRATNA GREŠKA |
|:-------:|:--:|:----------:|:------:|:----------------:|
|    1    | 71 |            |        |                  |
|    2    | 70 |   71.00    | -1.00  |      1.00        |
|    3    | 69 |   70.90    | -1.90  |      3.61        |
|    4    | 68 |   70.71    | -2.71  |      7.34        |
|    5    | 64 |   70.44    | -6.44  |     41.47        |
|    6    | 65 |   69.80    | -4.80  |     23.04        |
|    7    | 72 |   69.32    |  2.68  |      7.18        |
|    8    | 78 |   69.58    |  8.42  |     70.90        |
|    9    | 75 |   70.43    |  4.57  |     20.88        |
|   10    | 75 |   70.88    |  4.12  |     16.97        |
|   11    | 75 |   71.29    |  3.71  |     13.76        |
|   12    | 70 |   71.67    | -1.67  |      2.79        |


Suma kvadratnih grešaka (SSE) iznosi $208.94$. Prosečna kvadratna greška (MSE) je

$$
MSE = \frac{208.94}{11} = 19.0
$$
Možemo li bolje? Ponavljanjem istog procesa za $\alpha = 0.5$, dobijamo $MSE = 16.29$. Ovo je iterativni proces sve dok ne pronađemo najbolju vrednost za $\alpha$.

Većina softverskih alata ima implementiranu podršku za pronalaženje odgovarajućeg parametra $\alpha$ optimizacijom Marquardt algoritma.

**Marquardt algoritam** je zauzeo bitno mesto u matematici i računarstvu zbog svoje primene kod problema najmanjih kvadrata nelinearne funkcije. Najčešće se koristi kod minimizacije metoda najmanjih kvadrata kako bi dobili nelinearni model koji bliže određuje podatke.

Neka su dati $n$ empirijskih parova $(x_i, y_i)$ — vrednosti dobijene na osnovu iskustava ili činjenica. Cilj algoritma je pronaći parametre $\alpha$ modela $f(x, \alpha)$ tako da je razlika (odstupanje) između modela i stvarnih vrednosti minimalna. 
$$
\hat{\omega} = \underset{\alpha}{\arg\min} \sum_{i=1}^n \left[ y_i - f(x_i, \alpha) \right]^2
$$

Jednačina eksponencijalnog poravnanja generalno se može zapisati kao:

$$
S_{t+1} = \alpha x_t + (1 - \alpha) S_t, \quad 0 < \alpha \leq 1, \ t > 0
$$

Dalje, možemo je zapisati i kao:

$$
S_{t+1} = S_t + \alpha \varepsilon_t,
$$

gde je $\varepsilon_t$ greška predviđanja za vremenski period $t$.

Drugim rečima, novo predviđanje je staro predviđanje plus prilagođavanje (množenje konstantom $\alpha$) greške koja se javila u poslednjem predviđanju.

Jednostavno eksponencijalno poravnanje ne može uspešno da izvrši predikciju kod podataka kod kojih se javlja trend. Da bi prevazišao ovaj problem, Holt je 1957. godine proširio jednostavno eksponencijalno poravnanje dodavši još jednu jednačinu koja bliže opisuje uticaj trenda na podatke.

**Poravnanje sa dve jednačine – linearni trend metod (Holtov metod):**

$$
\begin{aligned}
S_t &= \alpha x_t + (1-\alpha)(S_{t-1} + b_{t-1}), \quad 0 \leq \alpha \leq 1 \\
b_t &= \beta (S_t - S_{t-1}) + (1-\beta) b_{t-1}, \quad 0 \leq \beta \leq 1
\end{aligned}
$$

Ovde je $b_{t-1}$ procena (nagib) trenda, dok je $\beta$ parametar poravnanja za trend. Konstanta $\beta$ se određuje u zavisnosti od $\alpha$.

Prva jednačina poravnanja prilagođava $S_t$ pod uticajem trenda prethodnog perioda $b_{t-1}$, dodajući ga na prethodnu poravnatu vrednost $S_{t-1}$. Druga jednačina dodeljuje novu vrednost trendu, izraženu kao razlika poslednje dve vrednosti (pod uticajem konstante $\beta$). Vidimo da je ova jednačina slična jednostavnom poravnanju, s tim da ovde vodimo računa o informacijama za trend podataka.

Optimalne vrednosti parametara $\alpha$ i $\beta$ mogu se odrediti optimizacijom Marquardt algoritma.

**Početne vrednosti $S_1$ i $b_1$**

Kao i kod jednostavnog poravnanja, postoji nekoliko načina za odabir inicijalnih vrednosti za $S_t$ i $b_t$ kod eksponencijalnog poravnanja sa dve jednačine:

- $S_1 = x_1$
- Za $b_1$ postoje tri mogućnosti:
    - $b_1 = y_2 - y_1$
    - $b_1 = \frac{1}{3} \left[(y_2 - y_1) + (y_3 - y_2) + (y_4 - y_3)\right]$
    - $b_1 = \frac{y_n - y_1}{n-1}$

**Predikcija koristeći poravnanje sa dve jednačine – linearni trend metod**

Predviđanje jedan korak unapred dato je formulom:
$$
\hat{y}_{t+1} = S_t + b_t
$$

Predviđanje $m$ koraka unapred dato je formulom:
$$
\hat{y}_{t+m} = S_t + m b_t
$$

Ovakvo predviđanje $m$ koraka unapred moguće je jer formula predviđanja više nije ravna, već imamo linearnu funkciju od $m$.

**Poravnanje sa dve jednačine – opadajući trend metod**

Predikcije generisane linearnom metodom prikazuju konstantan trend (rastući ili opadajući) beskonačno u budućnost. Da bi se ova karakteristika "ublažila", uvodi se parametar opadanja $\phi$, $0 < \phi < 1$, koji liniju predikcije u nekom trenutku dovodi do ravne linije.

Uz iste parametre kao kod linearnog metoda, uvodimo parametar opadanja:

$$
\begin{aligned}
S_t &= \alpha x_t + (1-\alpha)(S_{t-1} + \phi b_{t-1}) \\
b_t &= \gamma (S_t - S_{t-1}) + (1-\beta)\phi b_{t-1}
\end{aligned}
$$

Ukoliko je $\phi = 1$, opadajući trend metod je identičan linearnom trend metodu. Za vrednosti između 0 i 1, $\phi$ "ravna" funkciju tako da trend postaje konstantan u nekom trenutku. U praksi, $\phi$ je retko manji od 0.8, a obično se ograničava na $0.8 < \phi < 0.98$.

**Predikcija koristeći opadajući trend metod:**

Predviđanje jedan korak unapred:
$$
F_{t+1} = S_t + \phi b_t
$$

Predviđanje $m$ koraka unapred:
$$
F_{t+m} = S_t + (\phi + \phi^2 + \cdots + \phi^m) b_t
$$


Šta se dešava ukoliko vremenska serija pokazuje osobine trenda i sezonaliteta (periodičnosti)?

### Eksponencijalno poravnanje sa tri jednačine (Holt-Winters metoda)

Model koji uspešno radi sa podacima koji pokazuju i sezonalitet, pored prethodno navedenih jednačina, uvodi još jednu za sezonalitet. Rezultujući skup jednačina naziva se **Holt-Winters metoda**.

Jednačine su:

- **Jednačina poravnanja:**
    $$
    S_t = \alpha \frac{x_t}{I_{t-L}} + (1-\alpha)(S_{t-1} + b_{t-1})
    $$
- **Jednačina trenda:**
    $$
    b_t = \beta (S_t - S_{t-1}) + (1-\beta) b_{t-1}
    $$
- **Jednačina sezonaliteta:**
    $$
    I_t = \gamma \frac{x_t}{S_t} + (1-\gamma) I_{t-L}
    $$
- **Predikcija $m$ koraka unapred:**
    $$
    F_{t+m} = (S_t + m b_t) I_{t-L+m}
    $$

Gde su:
- $x_t$ — uzorak vremenske serije u trenutku $t$
- $S_t$ — komponenta poravnanja (level)
- $b_t$ — komponenta trenda
- $I_t$ — indeks sezonaliteta
- $F_{t+m}$ — predviđanje $m$ koraka unapred
- $L$ — period sezonaliteta (npr. 12 za mesečne podatke sa godišnjom sezonalnošću)
- $\alpha$, $\beta$, $\gamma$ — konstante poravnanja, trenda i sezonaliteta (0 < $\alpha$, $\beta$, $\gamma$ < 1)

Vrednosti konstanti $\alpha$, $\beta$ i $\gamma$ biraju se tako da greška (MSE) bude najmanja moguća — najčešće se softver koristi za njihovu optimizaciju.

Za inicijalizaciju Holt-Winters metode, potrebno je da u podacima postoji najmanje jedno potpuno javljanje sezonaliteta (bez praznih vremenskih intervala), kako bi se odredila početna vrednost $I_{t-L}$.


Sezonalitet se javlja među podacima u $L$ intervalu, gde je $L$ dužina perioda. Uticaj (faktor) trenda određujemo posmatrajući dva vremenska perioda, jedan za drugim. Da bismo zadovoljili pojavljivanje trenda i sezonaliteta, koristimo dva potpuna skupa vremenskih perioda gde se javlja sezonalitet – što daje ukupno $2L$ perioda vremena.

**Početne vrednosti – $b$ i $I$:**  
Formula za estimaciju početnog uticaja trenda:

$$
b = \frac{1}{L} \left( \frac{y_{L+1} - y_1}{L} + \frac{y_{L+2} - y_2}{L} + \cdots + \frac{y_{L+L} - y_L}{L} \right)
$$

**Početne vrednosti sezonskog uticaja:**

Pokazaćemo na primeru. Imamo podatke za prethodnih 6 godina, sa 4 vremenska perioda po godini (to su 4 kvartala).

**Korak 1:** Računamo prosek svakog vremenskog perioda (kvartala) u prethodnih 6 godina:

$$
A_p = \frac{\sum_{i=1}^4 x_i}{4}, \quad p = 1,2,\ldots,6
$$

**Korak 2:** Podeliti uzorke sa prosekom za tu godinu.

| Kvartal | Godina 1         | Godina 2         | Godina 3         | Godina 4         | Godina 5         | Godina 6         |
|:-------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|:----------------:|
|   1     | $x_1/A_1$        | $x_5/A_2$        | $x_9/A_3$        | $x_{13}/A_4$     | $x_{17}/A_5$     | $x_{21}/A_6$     |
|   2     | $x_2/A_1$        | $x_6/A_2$        | $x_{10}/A_3$     | $x_{14}/A_4$     | $x_{18}/A_5$     | $x_{22}/A_6$     |
|   3     | $x_3/A_1$        | $x_7/A_2$        | $x_{11}/A_3$     | $x_{15}/A_4$     | $x_{19}/A_5$     | $x_{23}/A_6$     |
|   4     | $x_4/A_1$        | $x_8/A_2$        | $x_{12}/A_3$     | $x_{16}/A_4$     | $x_{20}/A_5$     | $x_{24}/A_6$     |

**Korak 3:** Sezonske uticaje dobijamo tako što izračunamo prosek svakog reda (ista sezona, kvartal – različite godine):

$$
I_1 = \frac{x_1/A_1 + x_5/A_2 + x_9/A_3 + x_{13}/A_4 + x_{17}/A_5 + x_{21}/A_6}{6}
$$

$$
I_2 = \frac{x_2/A_1 + x_6/A_2 + x_{10}/A_3 + x_{14}/A_4 + x_{18}/A_5 + x_{22}/A_6}{6}
$$

$$
I_3 = \frac{x_3/A_1 + x_7/A_2 + x_{11}/A_3 + x_{15}/A_4 + x_{19}/A_5 + x_{23}/A_6}{6}
$$

$$
I_4 = \frac{x_4/A_1 + x_8/A_2 + x_{12}/A_3 + x_{16}/A_4 + x_{20}/A_5 + x_{24}/A_6}{6}
$$

Može se desiti da softverom za računanje eksponencijalnog poravnanja sa tri jednačine dobijemo da su parametri trenda ($\beta$) i sezonaliteta ($\gamma$) jednaki nuli, ili jedan od njih. To ne znači da njihov uticaj u predikciji ne postoji, već da su početne vrednosti $b$ (trenda) i/ili $I$ (sezonaliteta) tačno onoliko koliko treba, pa njihova izmena ne doprinosi smanjenju greške (MSE).


**slika 16**