# SOLID  -  Repaired

> Converted from `SOLID  -  Repaired.pptx`.

## 1. SOLID &

Clean Code

Robert C. Martin • Java • Spring Boot • Princípios • Prós e Contras

Objetivo: escrever software mais legível, testável,
modificável e resistente à evolução.

S

Responsabilidade

O

Extensibilidade

L

Substituição

I

Interfaces

D

Dependências

Boas práticas não substituem julgamento de engenharia.

SOLID & Clean Code • Robert C. Martin

## 2. Robert C. Martin — “Uncle Bob” e os livros

Princípios que conectam design orientado a objetos, legibilidade e arquitetura sustentável.

Robert C. Martin

• Engenheiro de software e autor
• Popularizou SOLID, Clean Code e Clean Architecture
• Ênfase: código precisa permanecer compreensível durante a evolução

Clean Code

A Handbook of Agile Software Craftsmanship
2008

Agile Software Development

Principles, Patterns, and Practices
2002

Clean Architecture

A Craftsman’s Guide to Software Structure and Design
2017

Ideia central

Clean Code trata da qualidade local do código. SOLID organiza responsabilidades e dependências no design orientado a objetos. Clean Architecture amplia os mesmos princípios para limites arquiteturais.

Código limpo

Fácil de ler e explicar
Pequeno e coeso
Nomes revelam intenção
Testes protegem comportamento

SOLID

Menos acoplamento indevido
Responsabilidades claras
Extensão sem alterar tudo
Dependências invertidas

Resultado esperado

Mudanças mais localizadas, testes mais simples e menor risco de “efeito dominó” entre classes e módulos.

## 3. O que é Clean Code?

Não é “código bonito”: é código que comunica intenção e reduz custo de mudança.

Objetivo

Produzir código que outra pessoa — inclusive você no futuro — consiga compreender, testar, corrigir e evoluir com baixo esforço cognitivo.
O foco está em clareza, coesão e simplicidade.

**`PedidoService.java — difícil de ler`**

```
public BigDecimal calc(P p) {
  BigDecimal x = p.getV();
  if (p.getT() == 1) x = x.multiply(.9);
  if (p.getC() != null) x = x.subtract(p.getC());
  if (x.signum() < 0) x = BigDecimal.ZERO;
  return x;
}
```

**`PricingService.java — intenção explícita`**

```
public Money calculatePrice(Order order) {
  Money subtotal = order.subtotal();
  Money discounted = discountPolicy.apply(subtotal, order);
  return discounted.max(Money.zero());
}
```

Nomes

Revelam intenção e evitam abreviações ambíguas.

Funções

Fazem uma coisa bem definida e em um único nível de abstração.

Fluxo

Poucas surpresas: happy path evidente e tratamento de erro consistente.

Duplicação

Regras repetidas são sinais de conceito ainda não modelado.

Testes

Documentam comportamento e dão segurança para refatorar.

Clean Code = comunicação + manutenção

## 4. Clean Code no dia a dia com Spring Boot

Práticas simples costumam trazer mais retorno do que abstrações sofisticadas.

Nomes específicos

createCustomer() é melhor que processData().

Métodos pequenos

Controller valida entrada e delega; regra fica no serviço/caso de uso.

DTOs e domínio separados

Evite expor entidade JPA diretamente como contrato HTTP.

Erros explícitos

Exceções de domínio + @ControllerAdvice para resposta HTTP consistente.

Dependências explícitas

Prefira injeção via construtor; facilita testes e torna acoplamentos visíveis.

Evite comentários compensatórios

Se precisa explicar “o que” o código faz, tente melhorar nomes e estrutura primeiro.

Baixa duplicação

Extraia conceitos reais; não crie abstração apenas porque duas linhas parecem iguais.

Testes legíveis

Arrange–Act–Assert; nomes que expressem cenário e resultado esperado.

Heurística útil

Se a leitura exige “simular mentalmente” muitas classes, estados e efeitos colaterais, existe oportunidade de simplificação.

## 5. SOLID — cinco princípios de design

Uma forma de pensar sobre responsabilidades, extensão, contratos, interfaces e dependências.

S

Single Responsibility

Uma classe deve ter uma razão principal para mudar.

O

Open/Closed

Aberto para extensão; fechado para modificação desnecessária.

L

Liskov Substitution

Subtipos devem poder substituir o tipo base sem quebrar o contrato.

I

Interface Segregation

Clientes não devem depender de operações que não utilizam.

D

Dependency Inversion

Código de alto nível depende de abstrações, não de detalhes voláteis.

Importante

SOLID não exige uma interface para toda classe. Aplique onde existe variação, dependência relevante ou responsabilidade que merece isolamento.

## 6. S — Single Responsibility Principle (SRP)

Uma unidade deve concentrar uma responsabilidade coerente e uma razão principal para mudar.

**`Antes — OrderService.java`**

```
@Service
class OrderService {
  private final OrderRepository repository;
  private final JavaMailSender mail;

  void create(CreateOrderRequest req) {
    if (req.items().isEmpty()) throw new IllegalArgumentException();
    BigDecimal total = req.items().stream()
        .map(ItemRequest::price).reduce(ZERO, BigDecimal::add);
    Order order = new Order(req.customerId(), total);
    repository.save(order);
    mail.send(buildConfirmation(order));
  }
}
```

**`Depois — responsabilidades separadas`**

```
@Service
class CreateOrderService {
  private final PricingService pricing;
  private final OrderRepository orders;
  private final OrderNotifier notifier;

  void create(CreateOrderCommand cmd) {
    Order order = Order.create(cmd, pricing.calculate(cmd));
    orders.save(order);
    notifier.orderCreated(order);
  }
}

@Component class PricingService { /* regra de preço */ }
interface OrderNotifier { void orderCreated(Order order); }
```

O que mudou?

Validação/regra, persistência e notificação deixaram de evoluir dentro da mesma classe.

Benefício

Testes menores, alteração localizada e menor chance de efeito colateral.

Cuidado

SRP não significa “uma função por classe”. Classes minúsculas sem coesão podem piorar a navegação.

## 7. O — Open/Closed Principle (OCP)

Quando uma regra possui variações reais, novas opções deveriam entrar por extensão — sem reescrever o fluxo central.

**`Antes — PaymentService.java`**

```
BigDecimal pay(String type, BigDecimal amount) {
  if (type.equals("PIX")) {
    return pixClient.charge(amount);
  }
  if (type.equals("CARD")) {
    return cardClient.charge(amount);
  }
  if (type.equals("BOLETO")) {
    return boletoClient.charge(amount);
  }
  throw new UnsupportedOperationException(type);
}
```

**`Depois — estratégia plugável no Spring`**

```
interface PaymentMethod {
  boolean supports(PaymentType type);
  Receipt pay(Money amount);
}

@Component class PixPayment implements PaymentMethod { ... }
@Component class CardPayment implements PaymentMethod { ... }

@Service
class PaymentService {
  private final List<PaymentMethod> methods;
  Receipt pay(PaymentType type, Money amount) {
    return methods.stream().filter(m -> m.supports(type))
      .findFirst().orElseThrow().pay(amount);
  }
}
```

Nova forma de pagamento

Antes: alterar método central.

Com OCP

Adicionar nova implementação e registrá-la no container Spring.

## 8. L — Liskov Substitution Principle (LSP)

Implementações de uma abstração devem preservar o contrato esperado pelo cliente.

Contrato

Se CustomerFinder promete retornar Optional&lt;Customer&gt;, qualquer implementação precisa respeitar semântica, nulabilidade, erros e invariantes equivalentes.

**`CustomerFinder.java`**

```
interface CustomerFinder {
  Optional<Customer> findById(CustomerId id);
}
```

**`Implementações substituíveis`**

```
@Repository class JpaCustomerFinder implements CustomerFinder { ... }
@Component class CachedCustomerFinder implements CustomerFinder { ... }
```

Violação típica

Uma implementação retorna null, lança UnsupportedOperationException em casos válidos ou muda regras essenciais do contrato. O consumidor passa a precisar de “if (impl instanceof ...)”.

Como verificar

Pergunte: “o cliente consegue trocar uma implementação por outra sem alterar seu código nem perder garantias?” Testes de contrato são uma boa técnica para conferir isso.

Spring Boot

@Primary, @Qualifier ou perfis podem trocar implementações; LSP garante que a troca não mude a semântica esperada.

## 9. I — Interface Segregation Principle (ISP)

Interfaces menores e orientadas ao cliente evitam dependências acidentais.

**`Antes — interface “faz tudo”`**

```
interface UserOperations {
  User create(CreateUserCommand cmd);
  User findById(UUID id);
  byte[] exportCsv();
  void resetPassword(UUID id);
  void delete(UUID id);
}

@RestController
class UserController {
  private final UserOperations operations;
  // depende até do que não usa
}
```

**`Depois — contratos por capacidade`**

```
interface CreateUserUseCase {
  UserId create(CreateUserCommand cmd);
}
interface FindUserQuery {
  UserView findById(UUID id);
}
interface ResetPasswordUseCase {
  void reset(UUID id);
}

@RestController
class UserController {
  private final CreateUserUseCase createUser;
  private final FindUserQuery findUser;
}
```

Objetivo

Cada cliente conhece apenas as operações que realmente precisa.

Ganho

Mudanças em exportação ou senha não “contaminam” consumidores de consulta.

Cuidado

Interfaces excessivamente fragmentadas aumentam arquivos e navegação sem benefício real.

## 10. D — Dependency Inversion Principle (DIP)

Regras de negócio dependem de abstrações estáveis; detalhes externos implementam essas abstrações.

OrderController

HTTP / REST

CheckoutService

regra de negócio

PaymentGateway

porta / abstração

AcquirerAdapter

SDK / API externa

implementa

**`CheckoutService.java`**

```
@Service
class CheckoutService {
  private final PaymentGateway payments;
  private final OrderRepository orders;

  CheckoutService(PaymentGateway payments,
                  OrderRepository orders) {
    this.payments = payments;
    this.orders = orders;
  }

  Receipt checkout(Order order) {
    orders.save(order);
    return payments.charge(order.total());
  }
}
```

**`Adapters / testes`**

```
interface PaymentGateway {
  Receipt charge(Money amount);
}

@Component
class AcquirerPaymentAdapter implements PaymentGateway { ... }

class FakePaymentGateway implements PaymentGateway {
  public Receipt charge(Money amount) {
    return Receipt.approved("test");
  }
}
```

Negócio não conhece SDK, HTTP client ou banco

## 11. SOLID em um fluxo Spring Boot

Os cinco princípios se combinam para manter o caso de uso estável e os detalhes substituíveis.

POST /orders

HTTP

OrderController

Adapter

CreateOrderUseCase

Application

Order

Domain

OrderRepository

Port

SRP

Controller trata HTTP; caso de uso coordena; domínio protege regra.

OCP

Novas políticas e adapters entram por extensão quando há variação.

LSP

JpaRepositoryAdapter e InMemoryAdapter preservam o mesmo contrato.

ISP

Use cases e ports expõem apenas operações necessárias.

DIP

Regra depende de portas; infraestrutura depende do núcleo.

Organização possível por feature

order/
api/OrderController.java
application/CreateOrderUseCase.java
domain/Order.java
infrastructure/JpaOrderRepositoryAdapter.java

O ponto principal

O pacote é secundário. O design deve tornar explícitos responsabilidades, contratos e direção das dependências — sem gerar cerimônia desnecessária.

## 12. Clean Code aplicado a Java + Spring Boot

Exemplo: Controller fino, validação declarativa, comando explícito e tratamento centralizado de erros.

**`OrderController.java`**

```
record CreateOrderRequest(
    @NotNull UUID customerId,
    @NotEmpty List<@Valid ItemRequest> items) {}

@RestController
@RequestMapping("/orders")
class OrderController {
  private final CreateOrderUseCase createOrder;

  @PostMapping
  ResponseEntity<OrderResponse> create(
      @Valid @RequestBody CreateOrderRequest request) {
    var command = CreateOrderCommand.from(request);
    var result = createOrder.execute(command);
    return ResponseEntity.status(CREATED)
        .body(OrderResponse.from(result));
  }
}
```

**`ApiExceptionHandler.java`**

```
@RestControllerAdvice
class ApiExceptionHandler {
  @ExceptionHandler(CustomerNotFound.class)
  ResponseEntity<ProblemDetail> notFound(CustomerNotFound ex) {
    var problem = ProblemDetail.forStatus(NOT_FOUND);
    problem.setDetail(ex.getMessage());
    return ResponseEntity.status(NOT_FOUND).body(problem);
  }
}
```

Legibilidade

Nomes expressam intenção e o happy path fica evidente.

Baixo acoplamento

Controller conhece caso de uso, não banco, mensageria ou SDK externo.

Regra prática

Spring facilita injeção e wiring; ele não cria automaticamente um bom design. A arquitetura continua sendo responsabilidade da equipe.

## 13. Prós e contras de Clean Code + SOLID

O ganho aparece quando os princípios reduzem custo de mudança — não quando viram um fim em si mesmos.

Prós

- Legibilidade e onboarding mais rápidos.
- Testes unitários mais simples por causa de responsabilidades e dependências explícitas.
- Mudanças localizadas e menor efeito dominó.
- Melhor substituição de detalhes externos: banco, API, mensageria, SDK.
- Facilita evolução incremental e refatoração segura.
- Design mais explícito para sistemas com domínio ou integrações complexas.

Contras / riscos

- Excesso de interfaces, classes e abstrações pode dificultar navegação.
- OCP prematuro cria extensibilidade para cenários que nunca existirão.
- Mais indireção pode esconder o fluxo real de execução.
- Granularidade excessiva gera “classe de uma linha” e boilerplate.
- Aplicação mecânica pode piorar CRUDs simples.
- Equipes precisam de critérios compartilhados; caso contrário, cada pessoa interpreta SOLID de forma diferente.

Princípio ≠ dogma: prefira clareza e evidência de mudança real

## 14. Quando aplicar — e quando não exagerar

Use SOLID e Clean Code como ferramentas de decisão, ajustando o rigor à complexidade e à taxa de mudança.

Aplique com mais força quando...

• Domínio possui regras de negócio relevantes
• Há várias integrações externas
• Estratégias/políticas mudam com frequência
• Sistema terá vida longa
• Testabilidade é requisito importante
• Muitas equipes trabalham no mesmo produto

Comece pelo essencial

1. Nomes e métodos claros
2. Separe responsabilidades óbvias
3. Injete dependências pelo construtor
4. Crie interfaces apenas em fronteiras/variações úteis
5. Escreva testes que protegem comportamento

Evite exagerar quando...

• CRUD simples e estável
• Protótipo descartável
• Variação futura é apenas hipótese
• Abstração não reduz acoplamento real
• A equipe passa mais tempo navegando entre interfaces do que entendendo regra

mais simples

mais complexo / volátil

CRUD pequeno

Clean Code básico
SOLID seletivo

Aplicação média

SRP + DIP + contratos claros

Domínio complexo

SOLID mais explícito
limites arquiteturais

## 15. Síntese para levar para o projeto

Clean Code melhora a unidade de código; SOLID melhora a estrutura de responsabilidades e dependências.

Clean Code

Clareza
Nomes
Coesão
Fluxo simples
Testes

S

Uma razão principal
para mudar

O

Estenda sem reescrever
o fluxo estável

L

Preserve contratos
ao substituir

I + D

Interfaces focadas
Dependências invertidas

Mensagem final

O melhor design não é o que contém mais padrões. É o que torna a mudança esperada simples, deixa a intenção evidente e permite testar comportamento sem carregar detalhes desnecessários.

Referências principais

MARTIN, R. C. Agile Software Development: Principles, Patterns, and Practices. 2002.   •   MARTIN, R. C. Clean Code: A Handbook of Agile Software Craftsmanship. 2008.   •   MARTIN, R. C. Clean Architecture: A Craftsman’s Guide to Software Structure and Design. 2017.

Pergunta para a equipe: esta abstração reduz custo de mudança ou apenas adiciona indireção?
