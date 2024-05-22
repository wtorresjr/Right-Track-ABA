import matplotlib.pyplot as plt
import numpy as np

from ml_learning_seed import Interval_Data

# Step 1: Aggregate the occurrences
aggregated_data = {}
for interval in Interval_Data:
    act = interval["activity"]
    tags = interval["interval_tags"]
    
    if act not in aggregated_data:
        aggregated_data[act] = {}
    
    for tag, occ in tags.items():
        if tag in aggregated_data[act]:
            aggregated_data[act][tag] += occ
        else:
            aggregated_data[act][tag] = occ

# Step 2: Prepare the data for plotting
activities_names = list(aggregated_data.keys())
tags = sorted(set(tag for tags in aggregated_data.values() for tag in tags))
data = {tag: [aggregated_data[activity].get(tag, 0) for activity in activities_names] for tag in tags}

# Step 3: Plot the stacked bar chart
fig, ax = plt.subplots(figsize=(12, 8))

bottom = np.zeros(len(activities_names))

for tag in tags:
    values = data[tag]
    ax.bar(activities_names, values, label=tag, bottom=bottom)
    bottom += np.array(values)

ax.set_xlabel('Activity')
ax.set_ylabel('Occurrences')
ax.set_title('Occurrences of Interval Tags by Activity')
ax.legend(title='Interval Tags')

plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.show()
