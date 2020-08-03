import pandas as pd

df = pd.read_excel('C:\\Users\\This PC\\Desktop\\rec.xlsx')

print(df)

print('For 10th level schooling -> 1','For 12th level schooling -> 2','For any technical diploma -> 3','For bachelor degree -> 4','For master degree -> 5',sep='\n')
print('For Ph.D -> 6')
user_edu = int(input('input your max edu code'))

print('For no degree -> 1','For degree in Technology -> 2','For degree in medical ->3','For degree in arts -> 4', 'For minimum any bachelor degree -> 5',sep = '\n')

user_stream = int(input('input your branch code'))

#max education , branch
is_edu = df['education']==user_edu 
df1 = df[is_edu]
print(df1)
df2 = df1.copy().loc[df['branch'] == user_stream]
print(df2)
m = df2['no_of_ratings'].quantile(0.90)
mf = df2['no_of_ratings'] > m
print(m)
print(df2[mf])
print('recommende jobs')


