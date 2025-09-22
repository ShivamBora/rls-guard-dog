

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { MongoClient } from 'https://deno.land/x/mongo@v0.31.1/mod.ts'


serve(async (_req) => {
  try {

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

//calling the function 
    const { data: averages, error: rpcError } = await supabase.rpc('calculate_class_averages')

    if (rpcError) {
      throw rpcError
    }

//mongodb coonect 
    const mongoUri = Deno.env.get('MONGO_URI')!
    const client = new MongoClient()
    await client.connect(mongoUri)


    const db = client.database('rls-guard-dog') 
    const collection = db.collection('class_averages')

//data save to mongo db
    // We use a bulkWrite with `upsert` to efficiently update or insert records.
    const operations = averages.map((avg: any) => ({
      updateOne: {
        filter: { classroom_id: avg.classroom_id },
        update: { $set: { average_score: avg.average_score, name: avg.name } },
        upsert: true,
      },
    }))


    if (operations.length > 0) {
      await collection.bulkWrite(operations)
    }
    
//confirmation messgae
    return new Response(
      JSON.stringify({ message: `Successfully updated ${operations.length} class averages.` }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (err) {
//error msg;
    const errorMessage = err instanceof Error ? err.message : String(err)
    return new Response(errorMessage, { status: 500 })
  }
})