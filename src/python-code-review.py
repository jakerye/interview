# Describe what this code does, then run it.
# If there are problems, explain and fix them

numbers = [1, -2, -3, 4, -5, 6, -7, 8, -9]
for num in numbers:
    if num < 0:
        numbers.remove(num)

# Problem is we are removing numbers from our iterable and 
# skipping over indexes

# Describe what this code does and point out any potential issues
import boto3
import sys
import asyncio
import pandas as pd


async def process_batch(path, batch):
    df = pd.concat(pd.read_csv(source) for source in batch)
    df.to_csv(path)
    return path

def in_batches(iterable, batch_size=100):
    batch = []
    for item in iterable:
        batch.append(item)
        if len(batch) > batch_size:
            yield batch
            batch = []
    # should yield last partial batch at end

async def main(bucket, prefix):
    s3 = boto3.client("s3")
    s3_files = s3.list_objects_v2(Bucket=bucket, Prefix=f"{prefix}/source")
    tasks = []
    for i, batch in enumerate(in_batches(s3_files)):
        path = f"s3://{bucket}/{prefix}/dest/part-{i}.csv"
        tasks.append(process_batch(path, batch))
    asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main(sys.argv[0], sys.argv[1]))

