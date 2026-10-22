import os, random, hashlib, string, math
from collections import Counter

class PasswordMutator:
    def __init__(self, base:str, minimum_length:int, target_score:float, max_iterations:int):
        self.base = base
        self.score = 0.0
        self.target_score = target_score
        self.max_iterations = max_iterations
        self.minimum_length = minimum_length
        self.shortness = max(30*(1 - (len(self.base)/self.minimum_length)),0) # How short is the input compared to the needed length
        print(f"Shortness: {self.shortness}")
        self.dup = set()
        self.mutated_char_count = 0
        self.tokens = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*(){}[];:\'\"\\,./?|~`"

    def mutate_case(self, input:str, likelihood:int) -> str: # Randomly changes num lowercase letter to upper case
        for i in range(len(input)):
            mutate = random.randint(0,likelihood)
            if not mutate:
                if input[i].islower():
                    input = input[:i] + input[i].upper() + input[i+1:]
                elif input[i].isupper():
                    input = input[:i] + input[i].lower() + input[i+1:]
        return input

    def mutate_characters(self, input:str, likelihood:int) -> str: # Randomly changes characters into another with 1:likelihood odds
        for i in range(len(input)):
            mutate = random.randint(0,likelihood)
            if not mutate:
                input = input[:i] + self.tokens[random.randint(0, len(self.tokens)-1)] + input[i+1:]
        return input


    def duplicate_character(self, input:str, likelihood:int) -> str: # Duplicates characters with 1:likelihood odds.
        for i in range(len(input)):
            if input[i] not in self.dup:
                mutate = random.randint(0,likelihood)
                if not mutate:
                    input = input[:i] + input[i] + input[i] + input[i+1:]
                    self.dup.add(input[i].lower()) # only duplicate each letter once
        return input

    # Strong function! Adding characters randomly to the string adds length and increases entropy.
    def insert_random_character(self, input:str) -> str: # Prepends or appends a random character
        token = self.get_random_token()
        #pos = random.randint(1, max(1, len(input)-1))
        choice = random.randint(0,1)
        if choice:
            return token + input
        else:
            return input + token
        #return input[:pos] + token + input[pos:]

    def insert_random_special(self, input:str) -> str: # Prepends or appends a random character
        token = self.get_random_special()
        #pos = random.randint(1, max(1, len(input)-1))
        choice = random.randint(0,1)
        if choice:
            return token + input
        else:
            return input + token
        #return input[:pos] + token + input[pos:]

    def substitute_character(self, input:str, likelihood:int) -> str:
        for i in range(0,len(input)):
            choice = random.randint(0,likelihood)
            match input[i]:
                case "a" | "A":
                    target = list(["@","4"])[random.randint(0,1)]
                case "e" | "E":
                    target = "3"
                case "i" | "I":
                    target = list(["!","1"])[random.randint(0,1)]
                case "o" | "O":
                    target = "0"
                case "s" | "S":
                    target = list(["5","$"])[random.randint(0,1)]
                case "l" | "L":
                    target = "1"
                case " ":
                    target = self.tokens[random.randint(62,len(self.tokens)-1)]
                    choice = random.randint(0,1)
                case _: target = input[i]
            if not choice:
                input = input[:i] + target + input[i+1:]
        return input

    def shuffle_insides(self, input:str) -> str: # Shuffles the order of the characters inside the password
        if len(input) <= 3:
            return input
        mid = list(input[1:-1])
        random.SystemRandom().shuffle(mid)
        return input[0] + ''.join(mid) + input[-1]
    
    def repeat_section(self, input:str, slice_size:int) -> str:
        ''' May want to make this repeat from the START of the string for recognition purposes '''
        #pos = random.randint(0, len(self.base)-1-slice_size)
        slice = self.base[0:random.randint(1,slice_size)]
        #slice = input[pos:slice_size]
        input = input + self.get_random_special() + slice
        return input
    
    def mutate_to_length(self, input:str) -> str:
        while len(input) < self.minimum_length:
            choice = random.randint(1,80)
            if choice < 10:
                temp = self.insert_random_special(input)
                if self.heuristic_entropy(temp) > self.heuristic_entropy(input):
                    input = temp
            elif choice < 60:
                temp = self.insert_random_character(input)
                if self.heuristic_entropy(temp) > self.heuristic_entropy(input):
                    input = temp
            elif choice < 70:
                temp = self.duplicate_character(input,self.minimum_length) # 1 in minimum length chance for any character to be duplicated
                if self.heuristic_entropy(temp) > 1.05*self.heuristic_entropy(input):
                    input = temp
            elif len(self.base) > 1:
                input = self.repeat_section(input,len(self.base)-int(len(self.base)/2))
        return input[0:self.minimum_length]

    def mutate_to_entropy(self, input:str) -> str:
        input = self.substitute_character(input,2) # perform one sweep of character substitution
        count = 0
        while self.heuristic_entropy(input) < self.target_score and count < self.max_iterations:
            choice = random.randint(1,100)
            if choice > 30 - self.shortness:
                input = self.mutate_case(input,3)
            elif choice > 35:
                input = self.reverse(input)
            elif self.mutated_char_count < len(self.base) // 4:
                input = self.mutate_characters(input,10)
                self.mutated_char_count += 1
            count += 1
        return input
    
    def mutate_total(self) -> str:
        count = 0
        best = (self.base, 0.0)
        while count < self.max_iterations: # Iterate some number of times and pick the best one OR the first one to hit the entropy goal
            temp = self.mutate_to_length(self.base)
            temp = self.mutate_to_entropy(temp)
            ent = self.heuristic_entropy(temp)
            if ent > best[1]:
                best = (temp,ent)
            count += 1
        return best[0]


    def get_random_token(self) -> str:
        return self.tokens[random.randint(1, len(self.tokens)-1)]
    
    def get_random_special(self) -> str:
        return self.tokens[random.randint(62,len(self.tokens)-1)]
    
    def reverse(self, input:str) -> str:
        temp = ""
        for c in input:
            temp = c + temp
        return str(temp)
    
    # This function computes heuristic entropy of the input password as a metric
    # It's not an attacker based model but it's good enough to provide a threshold to mutate towards.
    def heuristic_entropy(self, password: str) -> float:
        if not password:
            return 0.0

        length = len(password)

        # Classes for the characterset
        classes = {
            "lower": any(c.islower() for c in password),
            "upper": any(c.isupper() for c in password),
            "digit": any(c.isdigit() for c in password),
            "symbol": any(c in string.punctuation for c in password),
        }
        class_count = sum(classes.values())

        # Shannon entropy component (punishes repetition)
        counts = Counter(password)
        shannon = 0.0
        for cnt in counts.values():
            p = cnt / length
            shannon -= p * math.log2(p)
        shannon_bits = shannon * length # Essentially this is a penalty for repeating stuff

        # Combine factors:
        # - base bits from Shannon
        # - class diversity bonus (log2 growth)
        # - length bonus (diminishing returns for longer passwords but discourages shorter ones)
        entropy = (
            shannon_bits +
            math.log2(1 + class_count * 5) +
            math.log2(length)
        )
        return entropy

if __name__ == "__main__":
    pw = input("Provide password base: ")
    while True:
        try:
            minimum_length = int(input("Provide minimum length: "))
            mode = int(input("Enter mode code (0 = iterate, 1 = one shot, 2 = interface): "))
            break
        except ValueError:
            print("Please input an integer for minimum length and/or mode")
    mutator = PasswordMutator(pw,minimum_length,60.0,100)
    
    if mode == 1:
        print("Original heuristic entropy: " + str(mutator.heuristic_entropy(pw)))
        mutated = mutator.mutate_to_length(pw)
        print("Length-mutated heuristic entropy: " + str(mutator.heuristic_entropy(mutated)))
        print("Length Mutated Password: " + mutated)
        mutated = mutator.mutate_to_entropy(mutated)
        print("Character-mutated heuristic entropy: " + str(mutator.heuristic_entropy(mutated)))
        print("Final Mutated password: " + mutated)
    elif mode == 0:
        mutated = mutator.mutate_total()
        print("Final heuristic entropy: " + str(mutator.heuristic_entropy(mutated)))
        print("Computed password: " + mutated)
    elif mode == 2:
        strs = [pw]
        while True:
            curr = strs[len(strs)-1]
            print("Current password: " + curr)
            text = input("""Input command: 
                0=change_length, 1=repeat_chunk, 2=randomize_caps, 3=leet, 4=randomly_replace, 5=reverse, 6=undo, 7=done\n""")
            try:
                num = int(text)
            except ValueError:
                continue
            match num:
                case 0:
                    try:
                        newlen = input("Input new length: ")
                    except ValueError:
                        continue
                    mutator.minimum_length = int(newlen)
                    strs.append(mutator.mutate_to_length(curr))
                case 1:
                    strs.append(mutator.repeat_section(curr,len(mutator.base)))
                case 2:
                    strs.append(mutator.mutate_case(curr,2))
                case 3:
                    strs.append(mutator.substitute_character(curr,9))    
                case 4:
                    strs.append(mutator.mutate_characters(curr,6))
                case 5:
                    strs.append(mutator.reverse(curr))
                case 6:
                    if len(strs) > 1:
                        strs.pop()
                case 7:
                    break
                case _:
                    continue
            print("Current entropy: " + str(mutator.heuristic_entropy(curr)))
        print("Final password: " + strs[len(strs)-1])



