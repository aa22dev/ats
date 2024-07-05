import spacy
import sys
import json
import re
from nltk.stem import WordNetLemmatizer
import warnings

warnings.filterwarnings("ignore", message=r"\[W008\]", category=UserWarning)

nlp = spacy.load('en_core_web_md')
lemmatizer = WordNetLemmatizer()

def preprocess(s1): 
    s1 = s1.lower()
    s1 = re.sub(r"(?<!\w)\.(?!\b)|^\.", '', s1)
    s1 = lemmatizer.lemmatize(s1)
    return s1

def compute_similarity(text1, text2):
    doc1 = nlp(text1)
    doc2 = nlp(text2)
    return doc1.similarity(doc2)

def main():
    try:
        skill_pairs = json.loads(sys.argv[1])
        results = []
        for pair in skill_pairs:
            s1, s2 = preprocess(pair['s1']), preprocess(pair['s2'])
            score = compute_similarity(s1, s2)
            results.append({'s1': pair['s1'], 's2': pair['s2'], 'score': score})
        print(json.dumps(results, indent=4))
    except Exception as e:
        print(json.dumps({'error': str(e)}), indent=4)

if __name__ == "__main__":
    main()
